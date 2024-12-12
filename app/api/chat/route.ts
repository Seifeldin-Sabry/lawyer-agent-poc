import { NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import {vectorStore} from "@/pinecone/vector-store";
import {ChatPromptTemplate} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";

const systemPrompt = `
You are a legal assistant trained to analyze legal documents and answer questions based on the information provided in those documents. Below is the query you need to answer based on the legal documents available.

--- **Instructions**: 1. **Retrieve Documents**: Find the most relevant documents from the knowledge base that might 
help answer the query. This could include case law, statutes, contracts, regulations, and legal opinions. 2. 
**Analyze Content**: Identify and extract the key legal principles, provisions, or rulings in the documents that 
directly relate to the question at hand. 3. **Provide Legal Answer**: Using the extracted information, 
provide a clear, actionable, and legally sound response to the query. 4. **Cite Legal Sources**: Whenever applicable, 
reference specific legal provisions (e.g., laws, case precedents, clauses in contracts, etc.) that support your answer.

**Remember**: Your answer must be grounded in the documents provided and should be legally accurate. If the documents do not contain enough information, explicitly state that the answer cannot be determined based on the current documents.
---

{context}

CHAT HISTORY: {chat_history}
`

export async function POST(request: Request) {
    const { messages } = await request.json()

    if (!vectorStore) {
        return NextResponse.json({ error: 'No document has been uploaded yet' }, new Response( null, { status: 400 } ))
    }

    try {
        const model = new ChatOpenAI({ modelName: 'gpt-4o-mini' })
        const question = messages[messages.length - 1].content

        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system", systemPrompt],
            ["human", "{input}"],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain(
            {
                llm: model,
                prompt: promptTemplate
            }
        )

        const ragChain = await createRetrievalChain({
            retriever: vectorStore.asRetriever(),
            combineDocsChain: questionAnswerChain,
        })

        const response = await ragChain.invoke({
            input: question,
            chat_history: messages
        })

        return NextResponse.json(response.answer)
    } catch (error) {
        console.error('Error in chat:', error)
        return NextResponse.json({ error: 'Failed to process chat' }, new Response( null, { status: 500 } ))
    }
}

