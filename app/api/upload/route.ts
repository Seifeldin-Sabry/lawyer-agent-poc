import { NextResponse } from 'next/server'
import {vectorStore} from "@/pinecone/vector-store";
import {RecursiveCharacterTextSplitter} from "@langchain/textsplitters";

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, new Response(null, { status: 400 }))
    }

    try {
        await vectorStore.delete({deleteAll: true})

        const text = await file.text()

        // Split the text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        })

        const chunks = await splitter.createDocuments([text])

        const ids = await vectorStore.addDocuments(chunks)

        console.log('Added documents:', ids)
        return NextResponse.json({ message: 'Document processed successfully' })
    } catch (error) {
        console.error('Error processing document:', error)
        return NextResponse.json({ error: 'Failed to process document' },  new Response(null, { status: 500 }))
    }
}

