# import logging
# import sys
# import os.path
# from llama_index.core import Settings
# from llama_index.core.service_context import set_global_service_context
# from llama_index.llms.huggingface import HuggingFaceInferenceAPI
# from llama_index.embeddings.huggingface import HuggingFaceEmbedding
# from llama_index.core.prompts.chat_prompts import ChatPromptTemplate, ChatMessage, MessageRole
# from llama_index.core.chat_engine import CondenseQuestionChatEngine, ContextChatEngine
# from llama_index.core import PromptTemplate
# from llama_index.core import VectorStoreIndex, ServiceContext, Document, SimpleDirectoryReader, StorageContext, load_index_from_storage
# from huggingface_hub import login

# # Initialize logging
# logging.basicConfig(stream=sys.stdout, level=logging.INFO)
# logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

# # Hugging Face API login
# login("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")

# # Prompt template
# prompt_template = """### System: Use the following pieces of information to answer the user's question.
# If you don't know the answer, just say that you don't know, don't try to make up an answer.
# Only return the helpful answer below and nothing else.
# Helpful answer:
# """

# # Persistence directory
# PERSIST_DIR = "./storage"

# def load_data():
#     reader = SimpleDirectoryReader(input_files=["data/Biology 9.pdf"], recursive=True)
#     docs = reader.load_data()
#     llm = HuggingFaceInferenceAPI(
#       model_name = "HuggingFaceH4/zephyr-7b-beta",
#       api_key = "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"   
#     )
#     model_name = "BAAI/bge-large-en"
#     embed_model = HuggingFaceEmbedding(
#         model_name=model_name,
#     )
#     service_context = ServiceContext.from_defaults(
#         chunk_size=1000,
#         chunk_overlap=100,
#         embed_model=embed_model,
#         llm=llm
#     )
#     set_global_service_context(service_context)

#     if not os.path.exists(PERSIST_DIR):
#         index = VectorStoreIndex.from_documents(documents=docs, service_context=service_context)
#         index.storage_context.persist(persist_dir=PERSIST_DIR)
#     else:
#         storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
#         index = load_index_from_storage(storage_context)
#     return index

# index = load_data()

# def generate_text(prompt):
#     question = prompt
#     qa_prompt_str = (
#         "Context information is below.\n"
#         "---------------------\n"
#         "{context_str}\n"
#         "---------------------\n"
#         "Given only the context information and not prior knowledge, "
#         "answer the question: {query_str}\n"
#     )

#     # refine_prompt_str = (
#     #     "We have the opportunity to refine the original answer "
#     #     "(only if needed) with some more context below.\n"
#     #     "------------\n"
#     #     "{context_msg}\n"
#     #     "------------\n"
#     #     "Given the new context, refine the original answer to better "
#     #     "answer the question: {query_str}. "
#     #     "If the context isn't useful, output the original answer again.\n"
#     #     "Original Answer: {existing_answer}"
#     # )

#     chat_text_qa_msgs = [
#         ChatMessage(
#             role=MessageRole.SYSTEM,
#             content=(
#                 prompt_template
#             ),
#         ),
#         ChatMessage(
#             role=MessageRole.USER,
#             content=(
#                 qa_prompt_str
#             ),
#         ),
#     ]
#     text_qa_template = ChatPromptTemplate(chat_text_qa_msgs)

#     # Refine Prompt
#     chat_refine_msgs = [
#         ChatMessage(
#             role=MessageRole.SYSTEM,
#             content=(
#                 "If the context isn't helpful, just say I don't know. Don't add any information into the answer that is not available in the context"
#             ),
#         ),
#         ChatMessage(
#             role=MessageRole.USER,
#             content=(
#                 "New Context: {context_msg}\n"
#                 "Query: {query_str}\n"
#                 "Original Answer: {existing_answer}\n"
#                 "New Answer: "
#             ),
#         ),
#     ]
#     refine_template = ChatPromptTemplate(chat_refine_msgs)

#     custom_prompt = PromptTemplate(
#         """
#         Given a conversation (between Human and Assistant) and a follow-up message from Human,
#         rewrite the message to be a standalone question that captures all relevant context
#         from the conversation.

#         {chat_history} {question}
#         """
#     )

#     # List of ChatMessage objects
#     custom_chat_history = [
#         ChatMessage(
#             role=MessageRole.USER,
#             content="Hello assistant, we are having an insightful discussion about the given content and you are helping me understand the content by answering or summarizing and explaining me the content without changing its true meaning.",
#         ),
#         ChatMessage(role=MessageRole.ASSISTANT, content="Okay, sounds good."),
#     ]

#     query_engine = index.as_query_engine(
#         text_qa_template=text_qa_template, 
#         refine_template=refine_template, 
#         llm=Settings.llm
#     )

#     chat_engine = CondenseQuestionChatEngine.from_defaults(
#         query_engine=query_engine,
#         condense_question_prompt=custom_prompt,
#         chat_history=custom_chat_history,
#         verbose=True,
#     )
#     print(question)
#     response = chat_engine.chat(question)
#     return response.response

# user_input = input("Your question: ")
# response = generate_text(user_input)
# print(f"Assistant: {response}")
