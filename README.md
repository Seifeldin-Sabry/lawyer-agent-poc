### Lawyer Agent POC

tools used: NextJs, Langchain (for RAG and embeddings and text processing), PineCone Vector Database to store embeddings and retrieve via similarity

Improvements that could be made:
make the backend in Python to add Spacy and make PipelineComponent to retrieve the lessor/lessee 

Improve the system prompt a bit more, add a test suite to ensure accuracy, use a json format for model outputs, etc..


#### How it works now

1. Upload a document
2. (optional: not implemented) NLP with spacy to extract relevant data and make sure its always consistent (add metadata, essentially)
3.  the app will chunk and make embeddings
4.  the embeddings are stored in the vector db
5.  whenever we query the chat, we also use the query to get our context (most similar chunks/embeddings) and that becomes the RAG the model answers from
6.  We keep a chat history as well for the model
