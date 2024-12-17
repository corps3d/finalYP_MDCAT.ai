from typing import List
from dataclasses import dataclass
from pinecone import Pinecone
from langchain_pinecone import PineconeEmbeddings
from langchain_core.output_parsers import StrOutputParser


@dataclass
class SearchResult:
    """Stores search results with their content and metadata"""

    content: str
    metadata: dict
    score: float


class QAChatbot:
    def __init__(self, llm, prompt, top_k: int = 4):
        self.llm = llm
        self.prompt = prompt
        self.top_k = top_k
        self.embeddings = None
        self.index = None

    def setup(
        self,
        pinecone_api_key: str,
        index_name: str,
        embedding_model: str = "multilingual-e5-large",
    ):
        """Initialize the chatbot with Pinecone and embeddings"""
        try:
            # Setup embeddings
            self.embeddings = PineconeEmbeddings(
                model=embedding_model,
                encode_kwargs={"normalize_embeddings": True},
            )

            # Setup Pinecone
            pc = Pinecone(api_key=pinecone_api_key)
            self.index = pc.Index(index_name)

            return "Setup complete - ready to answer questions!"
        except Exception as e:
            return f"Setup failed: {str(e)}"

    def search(self, query: str) -> List[SearchResult]:
        """Search for relevant documents"""
        if not self.embeddings or not self.index:
            raise ValueError("Please run setup() first")

        # Get query embedding and search
        query_embedding = self.embeddings.embed_query(query)
        results = self.index.query(
            vector=query_embedding, top_k=self.top_k, include_metadata=True
        )

        # Format results
        return [
            SearchResult(
                content=match["metadata"]["text"],
                metadata={k: v for k, v in match["metadata"].items() if k != "text"},
                score=match["score"],
            )
            for match in results["matches"]
        ]

    def get_answer(self, question: str) -> str:
        """Get answer for a question using relevant context"""
        try:
            # Get relevant documents
            search_results = self.search(question)
            print(search_results)
            # Combine context
            context = "\n\n".join(result.content for result in search_results)

            # Format prompt with context and question
            formatted_prompt = self.prompt.format(context=context, question=question)

            # Get and parse response
            response = self.llm.invoke(formatted_prompt)
            parsed_response = StrOutputParser().invoke(response)

            return parsed_response.strip()

        except ValueError as e:
            return str(e)
        except Exception as e:
            return f"Error getting answer: {str(e)}"