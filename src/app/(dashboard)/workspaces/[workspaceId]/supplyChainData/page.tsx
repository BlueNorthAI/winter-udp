"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertCircle,
  ChevronDown,
  CheckCircle2,
  Database,
  History,
  Link2,
  PenSquare,
  Plus,
  Search,
  Trash2,
  X,
  ChevronUp,
  BookOpen,
  Layers,
  FileCode,
  BarChart3,
  Clock,
  Users,
  Truck,
  Box,
  Warehouse,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Bell,
  FileCheck,
  ClipboardList,
  ShieldAlert,
  Briefcase,
  DollarSign,
  FileBox,
  UserPlus,
  Edit,
  RefreshCw,
  CheckSquare,
  Mail,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

export default function SupplyChainPlatform() {
  const [activeMainTab, setActiveMainTab] = useState("actions")
  const [activeSubTab, setActiveSubTab] = useState("general")
  const [selectedObjectType, setSelectedObjectType] = useState<string | null>("product")
  const [selectedActionType, setSelectedActionType] = useState<string | null>("fill-customer-order")
  const [showActionDetails, setShowActionDetails] = useState(true)
  const [searchValue, setSearchValue] = useState("")
  const [displayName, setDisplayName] = useState("Fill Customer Order")
  const [description, setDescription] = useState("Fills a customer order with inventory and notifies customer")
  const [failureMessage, setFailureMessage] = useState("")
  const [numberValue, setNumberValue] = useState("0")
  const [showNotificationDialog, setShowNotificationDialog] = useState(false)
  const [notificationSubject, setNotificationSubject] = useState("")
  const [notificationContent, setNotificationContent] = useState("")
  const [showObjectDetails, setShowObjectDetails] = useState(false)
  const [activeObjectTab, setActiveObjectTab] = useState("fields")
  const [objectDetails, setObjectDetails] = useState({
    fields: [
      { name: "id", type: "string", required: true },
      { name: "name", type: "string", required: true },
      { name: "description", type: "string", required: false },
      { name: "sku", type: "string", required: true },
      { name: "price", type: "number", required: true },
      { name: "category", type: "string", required: true },
      { name: "stock", type: "number", required: true },
      { name: "supplier_id", type: "string", required: true },
      { name: "created_at", type: "date", required: true },
      { name: "updated_at", type: "date", required: true },
    ],
  })

  const [objectRelationships] = useState<Record<string, any[]>>({
    product: [
      { id: "prod-supp", name: "Supplied By", target: "supplier", cardinality: "many-to-one", required: true },
      { id: "prod-inv", name: "Stocked As", target: "inventory", cardinality: "one-to-many", required: true },
      { id: "prod-cat", name: "Categorized In", target: "category", cardinality: "many-to-many", required: false },
    ],
    supplier: [
      { id: "supp-prod", name: "Supplies", target: "product", cardinality: "one-to-many", required: false },
      { id: "supp-po", name: "Receives", target: "purchase-order", cardinality: "one-to-many", required: false },
      { id: "supp-loc", name: "Located At", target: "location", cardinality: "many-to-one", required: true },
    ],
    customer: [
      { id: "cust-order", name: "Places", target: "sales-order", cardinality: "one-to-many", required: false },
      { id: "cust-loc", name: "Located At", target: "location", cardinality: "many-to-one", required: true },
      { id: "cust-seg", name: "Belongs To", target: "segment", cardinality: "many-to-one", required: true },
    ],
    warehouse: [
      { id: "ware-inv", name: "Stores", target: "inventory", cardinality: "one-to-many", required: false },
      { id: "ware-loc", name: "Located At", target: "location", cardinality: "many-to-one", required: true },
      { id: "ware-ship", name: "Ships", target: "shipment", cardinality: "one-to-many", required: false },
    ],
    "transportation-lane": [
      { id: "lane-ship", name: "Routes", target: "shipment", cardinality: "one-to-many", required: false },
      { id: "lane-src", name: "Starts At", target: "location", cardinality: "many-to-one", required: true },
      { id: "lane-dest", name: "Ends At", target: "location", cardinality: "many-to-one", required: true },
    ],
  })

  const [objectIndexes] = useState<Record<string, any[]>>({
    product: [
      { id: "idx-prod-pk", name: "product_pkey", type: "PRIMARY KEY", fields: ["id"], unique: true },
      { id: "idx-prod-sku", name: "product_sku_idx", type: "UNIQUE", fields: ["sku"], unique: true },
      { id: "idx-prod-name", name: "product_name_idx", type: "INDEX", fields: ["name"], unique: false },
      { id: "idx-prod-cat", name: "product_category_idx", type: "INDEX", fields: ["category"], unique: false },
    ],
    supplier: [
      { id: "idx-supp-pk", name: "supplier_pkey", type: "PRIMARY KEY", fields: ["id"], unique: true },
      { id: "idx-supp-name", name: "supplier_name_idx", type: "INDEX", fields: ["name"], unique: false },
      { id: "idx-supp-email", name: "supplier_email_idx", type: "UNIQUE", fields: ["email"], unique: true },
    ],
    customer: [
      { id: "idx-cust-pk", name: "customer_pkey", type: "PRIMARY KEY", fields: ["id"], unique: true },
      { id: "idx-cust-email", name: "customer_email_idx", type: "UNIQUE", fields: ["email"], unique: true },
      { id: "idx-cust-name", name: "customer_name_idx", type: "INDEX", fields: ["name"], unique: false },
      { id: "idx-cust-segment", name: "customer_segment_idx", type: "INDEX", fields: ["segment"], unique: false },
    ],
    warehouse: [
      { id: "idx-ware-pk", name: "warehouse_pkey", type: "PRIMARY KEY", fields: ["id"], unique: true },
      { id: "idx-ware-name", name: "warehouse_name_idx", type: "UNIQUE", fields: ["name"], unique: true },
      { id: "idx-ware-loc", name: "warehouse_location_idx", type: "INDEX", fields: ["location_id"], unique: false },
    ],
    "transportation-lane": [
      { id: "idx-lane-pk", name: "lane_pkey", type: "PRIMARY KEY", fields: ["id"], unique: true },
      {
        id: "idx-lane-src-dest",
        name: "lane_src_dest_idx",
        type: "UNIQUE",
        fields: ["source_id", "destination_id"],
        unique: true,
      },
      { id: "idx-lane-src", name: "lane_source_idx", type: "INDEX", fields: ["source_id"], unique: false },
      { id: "idx-lane-dest", name: "lane_destination_idx", type: "INDEX", fields: ["destination_id"], unique: false },
    ],
  })

  const objectTypes = [
    // Master Data Objects
    {
      id: "product",
      name: "Product",
      icon: <Box className="h-4 w-4 text-emerald-500" />,
      status: "active",
      category: "master",
    },
    {
      id: "supplier",
      name: "Supplier",
      icon: <Briefcase className="h-4 w-4 text-blue-500" />,
      status: "active",
      category: "master",
    },
    {
      id: "customer",
      name: "Customer",
      icon: <Users className="h-4 w-4 text-indigo-500" />,
      status: "active",
      category: "master",
    },
    {
      id: "warehouse",
      name: "Warehouse",
      icon: <Warehouse className="h-4 w-4 text-orange-500" />,
      status: "active",
      category: "master",
    },
    {
      id: "transportation-lane",
      name: "Transportation Lane",
      icon: <Truck className="h-4 w-4 text-cyan-500" />,
      status: "active",
      category: "master",
    },
    {
      id: "manufacturing-facility",
      name: "Manufacturing Facility",
      icon: <FileBox className="h-4 w-4 text-purple-500" />,
      status: "active",
      category: "master",
    },

    // Transaction Data Objects
    {
      id: "purchase-order",
      name: "Purchase Order",
      icon: <ClipboardList className="h-4 w-4 text-gray-500" />,
      status: "active",
      category: "transaction",
    },
    {
      id: "sales-order",
      name: "Sales Order",
      icon: <ShoppingCart className="h-4 w-4 text-green-500" />,
      status: "active",
      category: "transaction",
    },
    {
      id: "inventory",
      name: "Inventory",
      icon: <Layers className="h-4 w-4 text-purple-500" />,
      status: "active",
      category: "transaction",
    },
    {
      id: "shipment",
      name: "Shipment",
      icon: <Truck className="h-4 w-4 text-green-500" />,
      status: "active",
      category: "transaction",
    },
    {
      id: "production-order",
      name: "Production Order",
      icon: <FileCheck className="h-4 w-4 text-teal-500" />,
      status: "active",
      category: "transaction",
    },
    {
      id: "invoice",
      name: "Invoice",
      icon: <DollarSign className="h-4 w-4 text-blue-500" />,
      status: "active",
      category: "transaction",
    },

    // Events/Alerts/Issues
    {
      id: "supply-disruption",
      name: "Supply Disruption",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      status: "active",
      category: "event",
    },
    {
      id: "inventory-threshold-alert",
      name: "Inventory Threshold Alert",
      icon: <ShieldAlert className="h-4 w-4 text-red-500" />,
      status: "active",
      category: "event",
    },
    {
      id: "lead-time-deviation",
      name: "Lead Time Deviation",
      icon: <Clock className="h-4 w-4 text-red-500" />,
      status: "active",
      category: "event",
    },
    {
      id: "quality-issue",
      name: "Quality Issue",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      status: "active",
      category: "event",
    },
    {
      id: "demand-spike",
      name: "Demand Spike",
      icon: <TrendingUp className="h-4 w-4 text-purple-500" />,
      status: "active",
      category: "event",
    },
    {
      id: "auto-replenishment-trigger",
      name: "Auto-Replenishment Trigger",
      icon: <RefreshCw className="h-4 w-4 text-green-500" />,
      status: "active",
      category: "event",
    },
  ]

  const actionTypes = [
    // Master Data Actions
    {
      id: "create-product",
      name: "Create Product",
      icon: <Plus className="h-4 w-4 text-emerald-500" />,
      category: "master",
    },
    {
      id: "update-product",
      name: "Update Product",
      icon: <Edit className="h-4 w-4 text-emerald-500" />,
      category: "master",
    },
    {
      id: "create-supplier",
      name: "Create Supplier",
      icon: <UserPlus className="h-4 w-4 text-blue-500" />,
      category: "master",
    },
    {
      id: "update-supplier",
      name: "Update Supplier",
      icon: <Edit className="h-4 w-4 text-blue-500" />,
      category: "master",
    },
    {
      id: "create-warehouse",
      name: "Create Warehouse",
      icon: <Plus className="h-4 w-4 text-orange-500" />,
      category: "master",
    },

    // Transaction Data Actions
    {
      id: "create-purchase-order",
      name: "Create Purchase Order",
      icon: <ClipboardList className="h-4 w-4 text-gray-500" />,
      category: "transaction",
    },
    {
      id: "update-purchase-order",
      name: "Update Purchase Order",
      icon: <Edit className="h-4 w-4 text-gray-500" />,
      category: "transaction",
    },
    {
      id: "create-sales-order",
      name: "Create Sales Order",
      icon: <ShoppingCart className="h-4 w-4 text-green-500" />,
      category: "transaction",
    },
    {
      id: "fill-customer-order",
      name: "Fill Customer Order",
      icon: <PenSquare className="h-4 w-4 text-green-500" />,
      category: "transaction",
    },
    {
      id: "create-shipment",
      name: "Create Shipment",
      icon: <Truck className="h-4 w-4 text-green-500" />,
      category: "transaction",
    },
    {
      id: "update-shipment-status",
      name: "Update Shipment Status",
      icon: <RefreshCw className="h-4 w-4 text-green-500" />,
      category: "transaction",
    },
    {
      id: "update-inventory",
      name: "Update Inventory Levels",
      icon: <Layers className="h-4 w-4 text-purple-500" />,
      category: "transaction",
    },
    {
      id: "create-production-order",
      name: "Create Production Order",
      icon: <FileCheck className="h-4 w-4 text-teal-500" />,
      category: "transaction",
    },

    // Event/Alert Actions
    {
      id: "create-quality-issue",
      name: "Create Quality Issue",
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      category: "event",
    },
    {
      id: "resolve-quality-issue",
      name: "Resolve Quality Issue",
      icon: <CheckSquare className="h-4 w-4 text-green-500" />,
      category: "event",
    },
    {
      id: "create-disruption-alert",
      name: "Create Disruption Alert",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      category: "event",
    },
    {
      id: "acknowledge-alert",
      name: "Acknowledge Alert",
      icon: <Bell className="h-4 w-4 text-orange-500" />,
      category: "event",
    },
    {
      id: "trigger-auto-replenishment",
      name: "Trigger Auto-Replenishment",
      icon: <RefreshCw className="h-4 w-4 text-green-500" />,
      category: "event",
    },
  ]

  const relations = [
    { id: "product-to-supplier", name: "Product to Supplier", icon: <Link2 className="h-4 w-4 text-blue-500" /> },
    { id: "supplier-to-warehouse", name: "Supplier to Warehouse", icon: <Link2 className="h-4 w-4 text-green-500" /> },
    { id: "product-to-inventory", name: "Product to Inventory", icon: <Link2 className="h-4 w-4 text-purple-500" /> },
    { id: "warehouse-to-customer", name: "Warehouse to Customer", icon: <Link2 className="h-4 w-4 text-orange-500" /> },
    {
      id: "purchase-order-to-supplier",
      name: "Purchase Order to Supplier",
      icon: <Link2 className="h-4 w-4 text-gray-500" />,
    },
    {
      id: "sales-order-to-customer",
      name: "Sales Order to Customer",
      icon: <Link2 className="h-4 w-4 text-indigo-500" />,
    },
    {
      id: "shipment-to-sales-order",
      name: "Shipment to Sales Order",
      icon: <Link2 className="h-4 w-4 text-green-500" />,
    },
  ]

  const handleActionClick = (id: string) => {
    setSelectedActionType(id)
    if (id === "fill-customer-order") {
      setShowActionDetails(true)
      setShowObjectDetails(false)
    } else {
      setShowActionDetails(false)
    }
  }

  const handleObjectTypeClick = (id: string) => {
    setSelectedObjectType(id)
    setShowObjectDetails(true)
    setShowActionDetails(false)
    setActiveObjectTab("fields")

    // Set specific fields based on the selected object type
    if (id === "product") {
      setObjectDetails({
        fields: [
          { name: "id", type: "string", required: true },
          { name: "name", type: "string", required: true },
          { name: "description", type: "string", required: false },
          { name: "sku", type: "string", required: true },
          { name: "price", type: "number", required: true },
          { name: "category", type: "string", required: true },
          { name: "stock", type: "number", required: true },
          { name: "supplier_id", type: "string", required: true },
          { name: "created_at", type: "date", required: true },
          { name: "updated_at", type: "date", required: true },
        ],
      })
    } else if (id === "supplier") {
      setObjectDetails({
        fields: [
          { name: "id", type: "string", required: true },
          { name: "name", type: "string", required: true },
          { name: "contact_name", type: "string", required: true },
          { name: "email", type: "string", required: true },
          { name: "phone", type: "string", required: true },
          { name: "address", type: "string", required: true },
          { name: "status", type: "string", required: true },
          { name: "created_at", type: "date", required: true },
        ],
      })
    } else if (id === "customer") {
      setObjectDetails({
        fields: [
          { name: "id", type: "string", required: true },
          { name: "name", type: "string", required: true },
          { name: "email", type: "string", required: true },
          { name: "phone", type: "string", required: false },
          { name: "address", type: "string", required: false },
          { name: "segment", type: "string", required: true },
          { name: "created_at", type: "date", required: true },
        ],
      })
    } else {
      // Default fields for other object types
      setObjectDetails({
        fields: [
          { name: "id", type: "string", required: true },
          { name: "name", type: "string", required: true },
          { name: "description", type: "string", required: false },
          { name: "status", type: "string", required: true },
          { name: "created_at", type: "date", required: true },
          { name: "updated_at", type: "date", required: true },
        ],
      })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleNewAction = () => {
    setShowNotificationDialog(true)
  }

  const handleTabChange = (tab: string) => {
    setActiveMainTab(tab)
    if (tab === "actions") {
      setSearchValue("")
      setSelectedActionType("fill-customer-order")
      setShowActionDetails(true)
      setShowObjectDetails(false)
    } else {
      setSearchValue("")
      setSelectedObjectType("product")
      setShowObjectDetails(true)
      setShowActionDetails(false)
    }
  }

  const handleSaveAction = () => {
    // Here you would typically save the action to your backend
    alert("Action saved successfully!")
  }

  const handleDeleteAction = () => {
    if (confirm("Are you sure you want to delete this action?")) {
      setShowActionDetails(false)
      setSelectedActionType(null)
    }
  }

  const handleSaveNotification = () => {
    setShowNotificationDialog(false)
    // Here you would typically save the notification configuration
    alert("Notification configured successfully!")
  }

  return (
    <div className="mx-4 flex h-screen flex-col">
      <header className="flex h-14 items-center border-b ">
        <div className="flex items-center gap-2">
          <Database className="h-6 w-6 text-blue-600" />
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold">Supply Chain Data Platform</h1>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center">
            <div className="flex items-center gap-2 mr-2">
              <Button variant="outline" size="sm" className="gap-1">
                <ChevronDown className="h-4 w-4" />
                Actions
              </Button>
            </div>
            <Badge variant="outline" className="mr-2 gap-1 border-red-200 bg-red-50 text-red-700">
              <AlertCircle className="h-3 w-3" />7 changes + 1 error
            </Badge>
            <Button variant="outline" size="sm" className="mr-2 gap-1">
              <History className="h-4 w-4" />
              Edits history
            </Button>
            <Button variant="outline" size="sm" className="mr-2">
              Discard working state
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveAction}>
              Save
            </Button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <div className="flex-1">
          <div className="border-b">
            <div className="flex">
              <Button
                variant={activeMainTab === "object-types" ? "primary" : "ghost"}
                className={`rounded-none border-b-2 ${
                  activeMainTab === "object-types" ? "border-blue-600" : "border-transparent"
                } px-4 py-2 text-sm font-medium`}
                onClick={() => handleTabChange("object-types")}
              >
                Source Data Tables
              </Button>
              <Button
                variant={activeMainTab === "actions" ? "primary" : "ghost"}
                className={`rounded-none border-b-2 ${
                  activeMainTab === "actions" ? "border-blue-600" : "border-transparent"
                } px-4 py-2 text-sm font-medium`}
                onClick={() => handleTabChange("actions")}
              >
                Write Back APIs
              </Button>
            </div>
          </div>
          <div className="flex h-[calc(100vh-8.5rem)]">
            <div className={`${showActionDetails || showObjectDetails ? "w-[280px]" : "w-full"} border-r`}>
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder={
                      activeMainTab === "object-types"
                        ? "Search object types"
                        : activeMainTab === "actions"
                          ? "Search action types"
                          : "Search relations"
                    }
                    className="pl-8"
                    value={searchValue}
                    onChange={handleSearchChange}
                  />
                  {activeMainTab === "actions" && searchValue && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setSearchValue("")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              <div className="h-[calc(100vh-14rem)] overflow-auto p-2">
                {activeMainTab === "object-types" && (
                  <div className="grid gap-1">
                    {objectTypes
                      .filter((type) =>
                        searchValue ? type.name.toLowerCase().includes(searchValue.toLowerCase()) : true,
                      )
                      .map((type) => (
                        <Button
                          key={type.id}
                          variant={selectedObjectType === type.id ? "secondary" : "ghost"}
                          className="justify-start gap-2 px-2 py-1.5 text-sm"
                          onClick={() => handleObjectTypeClick(type.id)}
                        >
                          {type.icon}
                          {type.name}
                        </Button>
                      ))}
                  </div>
                )}
                {activeMainTab === "relations" && (
                  <div className="grid gap-1">
                    {relations
                      .filter((relation) =>
                        searchValue ? relation.name.toLowerCase().includes(searchValue.toLowerCase()) : true,
                      )
                      .map((relation) => (
                        <Button key={relation.id} variant="ghost" className="justify-start gap-2 px-2 py-1.5 text-sm">
                          {relation.icon}
                          {relation.name}
                        </Button>
                      ))}
                  </div>
                )}
                {activeMainTab === "actions" && (
                  <div className="grid gap-1">
                    {actionTypes
                      .filter((type) =>
                        searchValue ? type.name.toLowerCase().includes(searchValue.toLowerCase()) : true,
                      )
                      .map((type) => (
                        <Button
                          key={type.id}
                          variant={selectedActionType === type.id ? "secondary" : "ghost"}
                          className="justify-start gap-2 px-2 py-1.5 text-sm"
                          onClick={() => handleActionClick(type.id)}
                        >
                          {type.icon}
                          {type.name}
                          {type.id === "fill-customer-order" && (
                            <div className="ml-auto flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <ChevronDown className="ml-1 h-4 w-4" />
                            </div>
                          )}
                        </Button>
                      ))}
                  </div>
                )}
              </div>
              <div className="p-2">
                <Button className="w-full gap-2 bg-green-600 hover:bg-green-700" onClick={handleNewAction}>
                  <Plus className="h-4 w-4" />
                  New{" "}
                  {activeMainTab === "object-types"
                    ? "object type"
                    : activeMainTab === "actions"
                      ? "action"
                      : "relation"}
                </Button>
              </div>
            </div>
            {showActionDetails && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-6 w-6 rounded bg-green-500 flex items-center justify-center">
                      <PenSquare className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="text-lg font-medium">Fill Customer Order</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveAction}>
                      Save
                    </Button>
                    <Button variant="destructive" size="sm" className="gap-1" onClick={handleDeleteAction}>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center border-b">
                  <div className="flex">
                    <Button
                      variant={activeSubTab === "general" ? "primary" : "ghost"}
                      className={`rounded-none border-b-2 ${
                        activeSubTab === "general" ? "border-blue-600" : "border-transparent"
                      } px-4 py-2 text-sm font-medium`}
                      onClick={() => setActiveSubTab("general")}
                    >
                      General
                    </Button>
                    <Button
                      variant={activeSubTab === "logic" ? "primary" : "ghost"}
                      className={`rounded-none border-b-2 ${
                        activeSubTab === "logic" ? "border-blue-600" : "border-transparent"
                      } px-4 py-2 text-sm font-medium`}
                      onClick={() => setActiveSubTab("logic")}
                    >
                      API Description
                    </Button>
                    <Button
                      variant={activeSubTab === "log" ? "primary" : "ghost"}
                      className={`rounded-none border-b-2 ${
                        activeSubTab === "log" ? "border-blue-600" : "border-transparent"
                      } px-4 py-2 text-sm font-medium`}
                      onClick={() => setActiveSubTab("log")}
                    >
                      API Parameters
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {activeSubTab === "general" && (
                    <div className="space-y-4">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">BASIC INFORMATION</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <ChevronUp className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="space-y-4 p-4 pt-0">
                            <div>
                              <label className="text-sm text-gray-500">RID</label>
                              <Input
                                className="mt-1 bg-gray-100"
                                value="ri.actions.main.action-type.c675df5a-1fe2-49c1-a3db-03ac373192d5"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">API Name</label>
                              <Input className="mt-1 bg-gray-100" value="fill-order-demo" readOnly />
                            </div>
                            <div>
                              <label className="text-sm text-gray-500">Display name</label>
                              <div className="relative mt-1">
                                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-9 w-9"
                                  onClick={() => setDisplayName("")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm text-gray-500 flex items-center gap-1">
                                Description
                                <span className="text-blue-500">*</span>
                              </label>
                              <div className="relative mt-1">
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-9 w-9"
                                  onClick={() => setDescription("")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                  {activeSubTab === "logic" && (
                    <div className="space-y-4">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">RULES</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-0">
                            <div className="border rounded-md p-4 relative">
                              <Button variant="ghost" size="icon" className="absolute right-2 top-2">
                                <X className="h-4 w-4" />
                              </Button>
                              <h3 className="font-medium mb-4">MODIFY OBJECT(S)</h3>
                              <div className="mb-4">
                                <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                                  <div className="h-5 w-5 bg-gray-800 flex items-center justify-center text-white text-xs rounded">
                                    D
                                  </div>
                                  <span>Order</span>
                                </div>
                              </div>
                              <div className="mb-4">
                                <h4 className="text-sm text-gray-500 mb-2">Properties</h4>
                                <div className="p-2 border rounded-md mb-2">
                                  <div className="flex items-center">
                                    <span className="text-sm">Quantity is set to </span>
                                    <span className="text-sm font-medium ml-1">Quantity</span>
                                    <span className="text-blue-500 ml-1">*</span>
                                  </div>
                                </div>
                                <div className="flex">
                                  <Button variant="outline" size="sm" className="gap-1">
                                    <Plus className="h-4 w-4" />
                                    Add property
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Button variant="outline" size="sm" className="gap-1">
                                  <Plus className="h-4 w-4" />
                                  Add new rule
                                  <ChevronDown className="h-4 w-4 ml-1" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">PARAMETERS</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-0">
                            <div className="mb-4">
                              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 mb-4">
                                <div className="h-5 w-5 bg-gray-800 flex items-center justify-center text-white text-xs rounded">
                                  D
                                </div>
                                <span>Order</span>
                              </div>
                              <div className="border rounded-md p-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 bg-gray-200 flex items-center justify-center text-gray-700 text-xs rounded">
                                    123
                                  </div>
                                  <div>
                                    <div className="font-medium">Quantity</div>
                                    <div className="text-xs text-gray-500">Quantity of item to Fill Order with</div>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Add new parameter
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">VALIDATION</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-0">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Plus className="h-4 w-4" />
                              Add new validation
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                  {activeSubTab === "log" && (
                    <div className="space-y-4">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm" className="gap-1">
                          <Link2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <FileCode className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">RULES</span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                      </Collapsible>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">PARAMETERS</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-0">
                            <div className="mb-4">
                              <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 mb-4">
                                <div className="h-5 w-5 bg-gray-800 flex items-center justify-center text-white text-xs rounded">
                                  D
                                </div>
                                <span>Order</span>
                              </div>
                              <div className="border rounded-md p-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 bg-gray-200 flex items-center justify-center text-gray-700 text-xs rounded">
                                    123
                                  </div>
                                  <div>
                                    <div className="font-medium">Quantity</div>
                                    <div className="text-xs text-gray-500">Quantity of item to Fill Order with</div>
                                  </div>
                                </div>
                              </div>
                              <div className="border rounded-md p-3 mb-2">
                                <div className="flex items-center gap-2">
                                  <div className="h-5 w-5 bg-gray-200 flex items-center justify-center text-gray-700 text-xs rounded">
                                    "
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="font-medium">Status</div>
                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Unused</Badge>
                                  </div>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Add new parameter
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                      <Collapsible defaultOpen className="border rounded-md">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4">
                          <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">VALIDATION</span>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-0">
                            <div className="mb-4">
                              <div className="flex items-center mb-2">
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <X className="h-4 w-4" />
                                </Button>
                                <div className="flex-1">
                                  <Select defaultValue="comparison">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select validation type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="comparison">Comparison</SelectItem>
                                      <SelectItem value="required">Required</SelectItem>
                                      <SelectItem value="format">Format</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="mb-2">
                                <Select defaultValue="property">
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select property" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="property">Property value(s) of parameter</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2 mb-2">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                                    <div className="h-5 w-5 bg-gray-800 flex items-center justify-center text-white text-xs rounded">
                                      D
                                    </div>
                                    <span>Order</span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50">
                                    <div className="h-5 w-5 bg-gray-200 flex items-center justify-center text-gray-700 text-xs rounded">
                                      "
                                    </div>
                                    <span>Quantity</span>
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                                    <ChevronDown className="h-4 w-4 ml-auto" />
                                  </div>
                                </div>
                              </div>
                              <div className="mb-2">
                                <Select defaultValue="greater">
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select comparison" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="greater">is greater than</SelectItem>
                                    <SelectItem value="less">is less than</SelectItem>
                                    <SelectItem value="equal">is equal to</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="mb-2">
                                <Select defaultValue="static">
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select value type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="static">Static value</SelectItem>
                                    <SelectItem value="parameter">Parameter value</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex gap-2 mb-4">
                                <div className="flex-1">
                                  <Select defaultValue="integer">
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="integer">Integer</SelectItem>
                                      <SelectItem value="string">String</SelectItem>
                                      <SelectItem value="boolean">Boolean</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex-1 relative">
                                  <Input
                                    type="number"
                                    value={numberValue}
                                    onChange={(e) => setNumberValue(e.target.value)}
                                  />
                                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={() => setNumberValue((prev) => (Number.parseInt(prev) + 1).toString())}
                                    >
                                      <ChevronUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-4 w-4"
                                      onClick={() => setNumberValue((prev) => (Number.parseInt(prev) - 1).toString())}
                                    >
                                      <ChevronDown className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm">with failure message</span>
                                <Input
                                  placeholder="Failure message"
                                  className="flex-1"
                                  value={failureMessage}
                                  onChange={(e) => setFailureMessage(e.target.value)}
                                />
                              </div>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Plus className="h-4 w-4" />
                                Add new validation
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}
                </div>
              </div>
            )}
            {showObjectDetails && (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center">
                    <div className="mr-2 h-6 w-6 rounded bg-blue-500 flex items-center justify-center">
                      {objectTypes.find((type) => type.id === selectedObjectType)?.icon || (
                        <Box className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <h2 className="text-lg font-medium">
                      {objectTypes.find((type) => type.id === selectedObjectType)?.name || "Object"}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="bg-blue-600 hover:bg-blue-700">Save</Button>
                    <Button variant="destructive" size="sm" className="gap-1">
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="flex justify-center border-b">
                  <div className="flex">
                    <Button
                      variant={activeObjectTab === "fields" ? "primary" : "ghost"}
                      className={`rounded-none border-b-2 ${
                        activeObjectTab === "fields" ? "border-blue-600" : "border-transparent"
                      } px-4 py-2 text-sm font-medium`}
                      onClick={() => setActiveObjectTab("fields")}
                    >
                      Fields
                    </Button>
                    <Button
                      variant={activeObjectTab === "relationships" ? "primary" : "ghost"}
                      className={`rounded-none border-b-2 ${
                        activeObjectTab === "relationships" ? "border-blue-600" : "border-transparent"
                      } px-4 py-2 text-sm font-medium`}
                      onClick={() => setActiveObjectTab("relationships")}
                    >
                      Relationships
                    </Button>
                    <Button
                      variant={activeObjectTab === "indexes" ? "primary" : "ghost"}
                      className={`rounded-none border-b-2 ${
                        activeObjectTab === "indexes" ? "border-blue-600" : "border-transparent"
                      } px-4 py-2 text-sm font-medium`}
                      onClick={() => setActiveObjectTab("indexes")}
                    >
                      Indexes
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {activeObjectTab === "fields" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Table Fields</h3>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add Field
                        </Button>
                      </div>

                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left p-2 font-medium text-sm">Name</th>
                              <th className="text-left p-2 font-medium text-sm">Type</th>
                              <th className="text-left p-2 font-medium text-sm">Required</th>
                              <th className="text-left p-2 font-medium text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {objectDetails.fields.map((field, index) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{field.name}</td>
                                <td className="p-2">
                                  <Badge variant="outline" className="font-mono">
                                    {field.type}
                                  </Badge>
                                </td>
                                <td className="p-2">
                                  {field.required ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
                                  ) : (
                                    <Badge variant="outline">No</Badge>
                                  )}
                                </td>
                                <td className="p-2">
                                  <div className="flex gap-1">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-medium mb-2">Sample Data</h3>
                        <div className="border rounded-md p-3 bg-gray-50">
                          <pre className="text-xs overflow-auto">
                            {JSON.stringify(
                              {
                                id: "prod-123456",
                                name: "Premium Widget",
                                description: "High-quality widget for industrial use",
                                sku: "WDG-PRM-001",
                                price: 129.99,
                                category: "Industrial",
                                stock: 250,
                                supplier_id: "sup-789012",
                                created_at: "2023-01-15T08:30:00Z",
                                updated_at: "2023-04-22T14:15:30Z",
                              },
                              null,
                              2,
                            )}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeObjectTab === "relationships" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Relationships</h3>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add Relationship
                        </Button>
                      </div>

                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left p-2 font-medium text-sm">Name</th>
                              <th className="text-left p-2 font-medium text-sm">Target</th>
                              <th className="text-left p-2 font-medium text-sm">Cardinality</th>
                              <th className="text-left p-2 font-medium text-sm">Required</th>
                              <th className="text-left p-2 font-medium text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedObjectType &&
                              objectRelationships[selectedObjectType]?.map((relation, index) => (
                                <tr key={index} className="border-b">
                                  <td className="p-2">{relation.name}</td>
                                  <td className="p-2">
                                    <div className="flex items-center gap-2">
                                      {objectTypes.find((t) => t.id === relation.target)?.icon || (
                                        <Link2 className="h-4 w-4 text-blue-500" />
                                      )}
                                      <span>
                                        {objectTypes.find((t) => t.id === relation.target)?.name || relation.target}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    <Badge variant="outline" className="font-mono">
                                      {relation.cardinality}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    {relation.required ? (
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
                                    ) : (
                                      <Badge variant="outline">No</Badge>
                                    )}
                                  </td>
                                  <td className="p-2">
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-medium m-2">Relationship Diagram</h3>
                        <div className="border rounded-md p-4 bg-gray-50 flex items-center justify-center">
                          <div className="text-center">
                            <div className="flex flex-col items-center">
                              <div className="m-4 p-3 border rounded-md bg-white shadow-sm">
                                <div className="flex items-center gap-2">
                                  {objectTypes.find((t) => t.id === selectedObjectType)?.icon}
                                  <span className="font-medium">
                                    {objectTypes.find((t) => t.id === selectedObjectType)?.name}
                                  </span>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                {selectedObjectType &&
                                  objectRelationships[selectedObjectType]?.slice(0, 4).map((relation, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                      <div className="h-8 w-px bg-gray-300"></div>
                                      <div className="bg-gray-200 text-xs px-2 py-1 rounded-full mb-2">
                                        {relation.cardinality}
                                      </div>
                                      <div className="p-3 border rounded-md bg-white shadow-sm">
                                        <div className="flex items-center gap-2">
                                          {objectTypes.find((t) => t.id === relation.target)?.icon || (
                                            <Link2 className="h-4 w-4 text-blue-500" />
                                          )}
                                          <span className="font-medium">
                                            {objectTypes.find((t) => t.id === relation.target)?.name || relation.target}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeObjectTab === "indexes" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">Indexes</h3>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Plus className="h-4 w-4" />
                          Add Index
                        </Button>
                      </div>

                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 border-b">
                              <th className="text-left p-2 font-medium text-sm">Name</th>
                              <th className="text-left p-2 font-medium text-sm">Type</th>
                              <th className="text-left p-2 font-medium text-sm">Fields</th>
                              <th className="text-left p-2 font-medium text-sm">Unique</th>
                              <th className="text-left p-2 font-medium text-sm">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedObjectType &&
                              objectIndexes[selectedObjectType]?.map((index, i) => (
                                <tr key={i} className="border-b">
                                  <td className="p-2">{index.name}</td>
                                  <td className="p-2">
                                    <Badge
                                      variant={index.type === "PRIMARY KEY" ? "default" : "outline"}
                                      className={index.type === "PRIMARY KEY" ? "bg-blue-500" : ""}
                                    >
                                      {index.type}
                                    </Badge>
                                  </td>
                                  <td className="p-2">
                                    <div className="flex flex-wrap gap-1">
                                      {index.fields.map((field: string, j: number) => (
                                        <Badge key={j} variant="secondary" className="font-mono">
                                          {field}
                                        </Badge>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-2">
                                    {index.unique ? (
                                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Yes</Badge>
                                    ) : (
                                      <Badge variant="outline">No</Badge>
                                    )}
                                  </td>
                                  <td className="p-2">
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-md font-medium mb-2">Performance Impact</h3>
                        <div className="border rounded-md p-4 bg-gray-50">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-1">Query Performance</h4>
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: "85%" }}></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Optimized</span>
                                <span>85%</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-1">Write Performance</h4>
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: "65%" }}></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Moderate impact</span>
                                <span>65%</span>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-1">Storage Impact</h4>
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: "30%" }}></div>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Low impact</span>
                                <span>30%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!showActionDetails && !showObjectDetails && (
              <div className="flex-1 p-8">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <h2 className="text-lg font-medium">
                      No{" "}
                      {activeMainTab === "object-types"
                        ? "object type"
                        : activeMainTab === "actions"
                          ? "action type"
                          : "relation"}{" "}
                      selected
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Please select an{" "}
                      {activeMainTab === "object-types"
                        ? "object type"
                        : activeMainTab === "actions"
                          ? "action type"
                          : "relation"}{" "}
                      from the list
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configure Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent className="sm:max-w-[600px] bg-gray-50">
          <DialogHeader className="flex flex-row items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <DialogTitle>Configure notification</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => setShowNotificationDialog(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Recipients</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm font-medium">Configuration</span>
                </div>
                <Select defaultValue="static">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select user or group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">A static user or group</SelectItem>
                    <SelectItem value="dynamic">A dynamic user or group</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Choose users or groups..." />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500">Content</h3>
              <div className="space-y-2">
                <Select defaultValue="template">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="template">Template</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Subject</h3>
              <Input
                placeholder="Subject"
                value={notificationSubject}
                onChange={(e) => setNotificationSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500">Body</h3>
              <Textarea
                placeholder="Content"
                className="min-h-[100px]"
                value={notificationContent}
                onChange={(e) => setNotificationContent(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-1 py-1 px-2">
                <div className="h-5 w-5 bg-gray-800 flex items-center justify-center text-white text-xs rounded">D</div>
                <span>Order</span>
              </Badge>
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-1 py-1 px-2">
                <div className="h-5 w-5 bg-gray-200 flex items-center justify-center text-gray-700 text-xs rounded">
                  123
                </div>
                <span>Quantity</span>
              </Badge>
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-1 py-1 px-2">
                <div className="h-5 w-5 bg-gray-200 flex items-center justify-center text-gray-700 text-xs rounded">
                  "
                </div>
                <span>Status</span>
              </Badge>
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-1 py-1 px-2">
                <div className="h-5 w-5 bg-gray-800 flex items-center justify-center text-white text-xs rounded">R</div>
                <span>Recipient</span>
              </Badge>
              <Badge className="bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center gap-1 py-1 px-2">
                <User className="h-4 w-4 text-gray-700" />
                <span>Current user</span>
              </Badge>
            </div>

            <div>
              <div className="flex items-center">
                <ChevronDown className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Link (optional)</span>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-green-500 hover:bg-green-600" onClick={handleSaveNotification}>
                Save
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
