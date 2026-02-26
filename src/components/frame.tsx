"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function Framework() {
  const [activeTab, setActiveTab] = useState("probe")

  const features = [
    {
      id: "probe",
      title: "Probe - Diagnostic Analytics",
      description:
        "Gain clear insights into your supply chain's past and present performance. Identify root causes of inefficiencies, understand demand and supply patterns, and uncover hidden trends with powerful data visualizations and drill-down capabilities.",
      icon: "probe",
      href: "/docs/transportation",
    },
    {
      id: "plan",
      title: "Plan - Optimization Analytics",
      description:
        "Make smarter, data-driven decisions with advanced modeling and scenario analysis. Optimize your supply chain network, inventory, and resource allocation to maximize service levels and minimize costs.",
      icon: "plan",
      href: "/docs/prod-plan",
    },
    {
      id: "perform",
      title: "Perform - Execution Analytics",
      description:
        "Translate strategy into action. Monitor real-time KPIs, track execution performance, and ensure alignment with business goals through automated alerts, dashboards, and performance scorecards.",
      icon: "perform",
      href: "/docs/ai-ct",
    },
  ]

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Three Core Features of the Supply Chain Analytics Platform
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center">
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            <Image
              src="/images/triangle.png"
              alt="Supply Chain Analytics Triangle"
              width={500}
              height={500}
              className="w-full"
            />

            {/* Interactive hotspots on the triangle - positioned for the new image */}
            <div
              className={`absolute top-[2%] left-[50%] transform -translate-x-1/2 cursor-pointer transition-all duration-300 ${activeTab === "probe" ? "scale-125" : "opacity-70"}`}
              onClick={() => setActiveTab("probe")}
            >
              <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-sky-500/50"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-sm font-medium text-sky-500">
                Probe
              </div>
            </div>

            <div
              className={`absolute bottom-[15%] left-[10%] transform -translate-x-1/2 cursor-pointer transition-all duration-300 ${activeTab === "perform" ? "scale-125" : "opacity-70"}`}
              onClick={() => setActiveTab("perform")}
            >
              <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-sky-500/50"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-sm font-medium text-sky-500">
                Perform
              </div>
            </div>

            <div
              className={`absolute bottom-[15%] right-[-5%] cursor-pointer transition-all duration-300 ${activeTab === "plan" ? "scale-125" : "opacity-70"}`}
              onClick={() => setActiveTab("plan")}
            >
              <div className="w-16 h-16 rounded-full bg-sky-500/20 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-sky-500/50"></div>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-sm font-medium text-sky-500">
                Plan
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          {/* Desktop Tabs View with Simple Border Style */}
          <div className="hidden md:block">
            <div className="border border-gray-200 rounded-lg">
              <div className="bg-white dark:bg-gray-800">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex">
                    {features.map((feature) => (
                      <a
                        key={feature.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab(feature.id)
                        }}
                        className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium transition-colors duration-200 ${
                          activeTab === feature.id
                            ? "border-sky-500 text-sky-600 dark:text-sky-400 dark:border-sky-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {feature.id.charAt(0).toUpperCase() + feature.id.slice(1)}
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="py-8 px-6">
                  {features.map((feature) => (
                    <div key={feature.id} className={`${activeTab === feature.id ? "block" : "hidden"}`}>
                      <div className="flex flex-col space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{feature.title}</h2>
                        <div className="flex items-start gap-4">
                          <div className="bg-gradient-to-br from-sky-400 to-cyan-600 p-3 rounded-lg">
                            {feature.icon === "probe" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                              </svg>
                            )}
                            {feature.icon === "plan" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                              </svg>
                            )}
                            {feature.icon === "perform" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-base md:text-lg text-gray-700 dark:text-gray-300">
                              {feature.description}
                            </p>
                            <Link
                              href={feature.href}
                              className="inline-flex items-center mt-4 text-sky-600 hover:text-sky-800 font-medium dark:text-sky-400 dark:hover:text-sky-300"
                            >
                              Learn more <ChevronRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="border border-gray-200 rounded-lg dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="-mb-px flex">
                    {features.map((feature) => (
                      <a
                        key={feature.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setActiveTab(feature.id)
                        }}
                        className={`w-1/3 py-3 px-1 text-center border-b-2 text-sm font-medium transition-colors duration-200 ${
                          activeTab === feature.id
                            ? "border-sky-500 text-sky-600 dark:text-sky-400 dark:border-sky-400"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        {feature.id.charAt(0).toUpperCase() + feature.id.slice(1)}
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="py-6 px-4">
                  {features.map((feature) => (
                    <div key={feature.id} className={`${activeTab === feature.id ? "block" : "hidden"}`}>
                      <div className="flex flex-col space-y-3">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{feature.title}</h2>
                        <div className="flex items-start gap-3">
                          <div className="bg-gradient-to-br from-sky-400 to-cyan-600 p-2 rounded-lg shrink-0">
                            {feature.icon === "probe" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <path d="m15 9-6 6" />
                                <path d="m9 9 6 6" />
                              </svg>
                            )}
                            {feature.icon === "plan" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <rect width="18" height="18" x="3" y="3" rx="2" />
                                <path d="M3 9h18" />
                                <path d="M9 21V9" />
                              </svg>
                            )}
                            {feature.icon === "perform" && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{feature.description}</p>
                            <Link
                              href={feature.href}
                              className="inline-flex items-center mt-3 text-sky-600 hover:text-sky-800 font-medium text-sm dark:text-sky-400 dark:hover:text-sky-300"
                            >
                              Learn more <ChevronRight className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
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
    </div>
  )
}
