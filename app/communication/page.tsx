"use client"

import { useState } from "react"
import Image from "next/image"
import { MessageSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/layout/app-shell"

// Sample vendor data
const initialVendors = [
  {
    id: 1,
    name: "Elegant Flowers",
    category: "Florist",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    name: "Dreamy Photography",
    category: "Photographer",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    name: "Grand Venue",
    category: "Venue",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 4,
    name: "Sunset Catering",
    category: "Catering",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 5,
    name: "Melody Makers",
    category: "Music",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 6,
    name: "Sweet Delights Bakery",
    category: "Cake",
    image: "/placeholder.svg?height=200&width=200",
  },
]

// Sample message data
const initialMessages = {
  1: [
    {
      id: 1,
      sender: "vendor",
      text: "Hello! Thank you for your interest in our floral services. How can we help with your wedding?",
      timestamp: "2023-05-15T10:30:00",
    },
    {
      id: 2,
      sender: "user",
      text: "Hi! I'm interested in discussing centerpiece options for my wedding in June.",
      timestamp: "2023-05-15T10:35:00",
    },
    {
      id: 3,
      sender: "vendor",
      text: "Great! We have several beautiful options for June weddings. Would you prefer seasonal flowers or a specific color scheme?",
      timestamp: "2023-05-15T10:40:00",
    },
    {
      id: 4,
      sender: "user",
      text: "I'm thinking of a blush and ivory color scheme. Do you have any examples you could share?",
      timestamp: "2023-05-15T10:45:00",
    },
    {
      id: 5,
      sender: "vendor",
      text: "Blush and ivory is a beautiful combination. I'll send over some examples of centerpieces we've done in those colors. Would you also like to see some bouquet options?",
      timestamp: "2023-05-15T10:50:00",
    },
  ],
  3: [
    {
      id: 1,
      sender: "vendor",
      text: "Thank you for your interest in Grand Venue! We'd be honored to host your special day.",
      timestamp: "2023-05-10T14:00:00",
    },
    {
      id: 2,
      sender: "user",
      text: "Thanks for getting back to me. I'm wondering if you have availability on June 15th next year?",
      timestamp: "2023-05-10T14:10:00",
    },
    {
      id: 3,
      sender: "vendor",
      text: "Let me check our calendar. Yes, we do have that date available! Would you like to schedule a tour of the venue?",
      timestamp: "2023-05-10T14:15:00",
    },
    {
      id: 4,
      sender: "user",
      text: "That would be great. What times do you have available for tours next week?",
      timestamp: "2023-05-10T14:20:00",
    },
  ],
  4: [
    {
      id: 1,
      sender: "user",
      text: "Hello, I'm interested in your catering services for my wedding next June.",
      timestamp: "2023-05-20T09:00:00",
    },
    {
      id: 2,
      sender: "vendor",
      text: "Hi there! We'd love to cater your wedding. Our team specializes in creating memorable dining experiences. Do you have a specific cuisine in mind?",
      timestamp: "2023-05-20T09:15:00",
    },
    {
      id: 3,
      sender: "user",
      text: "We're thinking of a Mediterranean-inspired menu. Do you offer that?",
      timestamp: "2023-05-20T09:20:00",
    },
  ],
}

export default function CommunicationPage() {
  const [vendors] = useState(initialVendors)
  const [messages, setMessages] = useState(initialMessages)
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showVendorList, setShowVendorList] = useState(false)

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedVendor) {
      const vendorId = selectedVendor.id
      const newMessageObj = {
        id: messages[vendorId] ? messages[vendorId].length + 1 : 1,
        sender: "user",
        text: newMessage,
        timestamp: new Date().toISOString(),
      }

      setMessages({
        ...messages,
        [vendorId]: messages[vendorId] ? [...messages[vendorId], newMessageObj] : [newMessageObj],
      })
      setNewMessage("")
    }
  }

  return (
    <AppShell>
      <main className="flex-1">
        <div className="container px-4 py-6 md:py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold">Vendor Communication</h1>
              <p className="text-muted-foreground">Keep track of all your vendor conversations</p>
            </div>
          </div>

          <div className="grid gap-4 md:gap-6 lg:grid-cols-[280px_1fr]">
            <div id="vendor-list" className={`space-y-4 ${showVendorList ? "block" : "hidden"} md:block`}>
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search vendors"
                />
              </div>
              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">
                    Unread
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  <ScrollArea className="h-[calc(100vh-280px)] md:h-[calc(100vh-300px)]">
                    <div className="space-y-2">
                      {filteredVendors.map((vendor) => (
                        <button
                          key={vendor.id}
                          className={`w-full rounded-lg p-3 text-left transition-colors hover:bg-muted ${
                            selectedVendor && selectedVendor.id === vendor.id ? "bg-muted" : ""
                          }`}
                          onClick={() => {
                            setSelectedVendor(vendor)
                            setShowVendorList(false)
                          }}
                          aria-selected={selectedVendor && selectedVendor.id === vendor.id}
                          role="option"
                        >
                          <div className="flex items-center gap-3">
                            <Image
                              src={vendor.image || "/placeholder.svg"}
                              alt={`Profile picture of ${vendor.name}, ${vendor.category} vendor`}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                            <div>
                              <div className="font-medium">{vendor.name}</div>
                              <div className="text-xs text-muted-foreground">{vendor.category}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="unread" className="mt-4">
                  <div className="flex h-[calc(100vh-300px)] items-center justify-center text-center">
                    <div>
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">No unread messages</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        When you have unread messages, they'll appear here
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="md:hidden mb-4">
              <Button
                variant="outline"
                className="w-full"
                aria-expanded={showVendorList}
                aria-controls="vendor-list"
                onClick={() => setShowVendorList(!showVendorList)}
              >
                {showVendorList ? "Hide Vendors" : "Show Vendors"}
              </Button>
            </div>
            <Card>
              {selectedVendor ? (
                <>
                  <CardHeader className="border-b">
                    <div className="flex items-center gap-3">
                      <Image
                        src={selectedVendor.image || "/placeholder.svg"}
                        alt={`Profile picture of ${selectedVendor.name}, ${selectedVendor.category} vendor`}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <CardTitle>{selectedVendor.name}</CardTitle>
                        <CardDescription>{selectedVendor.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[calc(100vh-350px)] md:h-[calc(100vh-400px)] p-4">
                      <div className="space-y-4">
                        {messages[selectedVendor.id] ? (
                          messages[selectedVendor.id].map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 md:p-3 ${
                                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                                }`}
                              >
                                <div className="text-sm break-words">{message.text}</div>
                                <div className="mt-1 text-right text-xs text-slate-500 dark:text-slate-400">
                                  {`${new Date(message.timestamp).getHours().toString().padStart(2, "0")}:${new Date(message.timestamp).getMinutes().toString().padStart(2, "0")}`}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex h-full items-center justify-center text-center">
                            <div>
                              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                              <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                              <p className="mt-2 text-sm text-muted-foreground">
                                Start a conversation with {selectedVendor.name}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="border-t p-3 md:p-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder={`Message ${selectedVendor.name}...`}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleSendMessage()
                            }
                          }}
                          className="flex-1"
                          aria-label={`Type a message to ${selectedVendor.name}`}
                        />
                        <Button size="icon" onClick={handleSendMessage} className="shrink-0" aria-label="Send message">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </>
              ) : (
                <div className="flex h-[calc(100vh-280px)] md:h-[calc(100vh-200px)] items-center justify-center text-center">
                  <div>
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No conversation selected</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select a vendor from the list to view your conversation
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </AppShell>
  )
}

