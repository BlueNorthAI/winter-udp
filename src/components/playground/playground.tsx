"use client"

import { useState } from "react"
import { Settings, Code, ExternalLink, PlusCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ExampleCard } from "./example-card"
import { ModelSelector } from "./model-selector"

export function Playground() {
  const [prompt, setPrompt] = useState("")
  const [aiJudgeEnabled, setAiJudgeEnabled] = useState(true)
  const [syntheticQuestionEnabled, setSyntheticQuestionEnabled] = useState(true)

  const examples = [
    {
      id: "sentiment",
      title: "Sentiment analysis",
      description:
        "You will be provided with a tweet, and your task is to classify its sentiment as positive, neutral, or negative.",
    },
    {
      id: "parsing",
      title: "Unstructured text parsing",
      description: "You will be provided with unstructured data, and your task is to parse it into JSON format.",
    },
    {
      id: "summarization",
      title: "Summarization",
      description: "You will be provided with a document and asked to summarize it.",
    },
    {
      id: "qa",
      title: "Document Q&A",
      description: "You will be provided with a document and asked a question about it.",
    },
  ]

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold">Playground</h1>
          <span className="text-sm px-2 py-0.5 bg-blue-100 text-blue-800 rounded">Preview</span>
          <Button variant="primary" className="text-blue-600 flex items-center gap-1 h-auto p-0 ml-2">
            Provide feedback
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-gray-500" />
        <Code className="h-5 w-5 text-gray-500" />
        <div className="ml-auto">
          <ModelSelector />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="border rounded-md p-6">
          <h2 className="text-lg font-medium mb-4">Start with an example</h2>
          <div className="space-y-4">
            {examples.map((example) => (
              <ExampleCard
                key={example.id}
                title={example.title}
                description={example.description}
                onTry={() => console.log(`Try ${example.id}`)}
              />
            ))}
          </div>
        </div>

        <div className="border rounded-md p-6">
          <h2 className="text-lg font-medium mb-4 flex items-center">
            <span className="text-purple-500 mr-2">✧</span>
            Evaluation
          </h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">AI Judge</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get assessments from LLM judges in Mosaic AI Agent Evaluation.{" "}
                  <a href="#" className="text-blue-600 inline-flex items-center">
                    Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                </p>
              </div>
              <Switch checked={aiJudgeEnabled} onCheckedChange={setAiJudgeEnabled} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Synthetic question generation</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get question suggestions automatically from response data sources.{" "}
                  <a href="#" className="text-blue-600 inline-flex items-center">
                    Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
                  </a>
                </p>
              </div>
              <Switch checked={syntheticQuestionEnabled} onCheckedChange={setSyntheticQuestionEnabled} />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <div className="border rounded-md mb-2">
          <div className="p-2 border-b flex items-center">
            <Button variant="ghost" size="sm" className="text-blue-600 flex items-center gap-1">
              <PlusCircle className="h-4 w-4" />
              Add system prompt
            </Button>
          </div>
          <div className="p-2 relative">
            <Textarea
              placeholder="Start typing..."
              className="min-h-24 resize-none border-0 focus-visible:ring-0 p-2"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button
              size="icon"
              className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Models called in Playground may be subject to license requirements and/or use policies.{" "}
          <a href="#" className="text-blue-600 inline-flex items-center">
            Learn more <ExternalLink className="h-3 w-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
