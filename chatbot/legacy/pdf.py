from llama_index.core import StorageContext, ServiceContext, VectorStoreIndex, load_index_from_storage
from llama_index.core import SimpleDirectoryReader
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.huggingface import HuggingFaceInferenceAPI
from llama_index.core import set_global_tokenizer
from transformers import AutoTokenizer
from llama_index.core import Settings
from llama_index.core.evaluation import ResponseEvaluator
import os

set_global_tokenizer(
    AutoTokenizer.from_pretrained("HuggingFaceH4/zephyr-7b-beta").encode
)

embed_model = HuggingFaceEmbedding(
    model_name = "BAAI/bge-large-en"
)
        
llm = HuggingFaceInferenceAPI(
    model_name="HuggingFaceH4/zephyr-7b-beta"
)

Settings.llm = llm
Settings.embed_model = embed_model


def get_index(data, index_name):
    index = None
    if not os.path.exists(index_name):
        print("building index....")
        
        index = VectorStoreIndex.from_documents(data, show_progress=True)
        index.storage_context.persist(persist_dir=index_name)
    else:
        index = load_index_from_storage(StorageContext.from_defaults(persist_dir=index_name))
    
    return index


data = SimpleDirectoryReader("C:/Users/corpsed/Documents/7th Semester/Fyp_Chatbot/chatbot/data").load_data()
index = get_index(data, "biology")
eval = ResponseEvaluator(llm=llm)
engine = index.as_query_engine(response_mode="tree_summarize")



