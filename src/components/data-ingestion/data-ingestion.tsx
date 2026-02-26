"use client"

import { Search, Database, Upload, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ConnectorCard } from "./connector-card"
import { DataSourceCard } from "./data-source-card"

export function DataIngestion() {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Add data</h1>
        <p className="text-muted-foreground">Get started by connecting to a data source or uploading a local file.</p>
      </div>

      <div className="relative mb-6">
        <div className="flex items-center border rounded-md">
          <Input
            type="search"
            placeholder="Search data sources"
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <div className="px-3 border-l h-full flex items-center">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-red-100 rounded flex items-center justify-center">
            <div className="h-3 w-3 bg-red-500 rounded"></div>
          </div>
          <h2 className="font-medium">bnai connectors</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ConnectorCard
            name="Salesforce"
            icon="/salesforce-logo.png"
            iconFallback={
              <div className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center">SF</div>
            }
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataSourceCard
            icon={<Database className="h-6 w-6 text-white" />}
            iconBg="bg-blue-500"
            title="Create or modify table"
            description="Upload tabular data files to create a new table or replace an existing one"
          />
          <DataSourceCard
            icon={<Upload className="h-6 w-6 text-white" />}
            iconBg="bg-blue-500"
            title="Upload files to a volume"
            description="Add files in any format to a non-tabular dataset managed in Unity Catalog"
          />
          <DataSourceCard
            icon={<FileText className="h-6 w-6 text-white" />}
            iconBg="bg-green-500"
            title="Create table from Azure Data Lake Storage"
            description="Create a table from tabular data files in ADLS using a Unity Catalog external location"
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-medium">Fivetran connectors</h2>
          <Button variant="primary" className="text-blue-600 p-0 h-auto flex items-center gap-1">
            See all available ingest partners in Partner Connect
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <ConnectorCard
            name="OneDrive"
            icon="/onedrive-logo.png"
            iconFallback={
              <div className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center">OD</div>
            }
          />
          <ConnectorCard
            name="Google Drive"
            icon="/google-drive-logo.png"
            iconFallback={
              <div className="bg-green-500 text-white h-10 w-10 rounded flex items-center justify-center">GD</div>
            }
          />
          <ConnectorCard
            name="Jira"
            icon="/jira-logo.png"
            iconFallback={
              <div className="bg-blue-500 text-white h-10 w-10 rounded-lg flex items-center justify-center">J</div>
            }
          />
          <ConnectorCard
            name="GitHub"
            icon="/github-logo.png"
            iconFallback={
              <div className="bg-gray-900 text-white h-10 w-10 rounded-full flex items-center justify-center">GH</div>
            }
          />
          <ConnectorCard
            name="Webhooks"
            icon="/webhooks-logo.png"
            iconFallback={
              <div className="bg-purple-500 text-white h-10 w-10 rounded flex items-center justify-center">WH</div>
            }
          />
          <div className="flex items-center justify-center">
            <Button variant="teritary" className="text-blue-600">
              See all →
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-medium mb-4">Legacy products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DataSourceCard
            icon={<Upload className="h-6 w-6 text-white" />}
            iconBg="bg-blue-500"
            title="Upload files to DBFS"
            description=""
          />
        </div>
      </div>
    </div>
  )
}
