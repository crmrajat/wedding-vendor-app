"use client"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Heart, Plus, Search, Star } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { AppShell } from "@/components/layout/app-shell"
import { vendorSchema } from "@/lib/validations"

// Sample vendor data
const initialVendors = [
  {
    id: 1,
    name: "Elegant Flowers",
    category: "Florist",
    rating: 5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Specializing in elegant floral arrangements for weddings.",
    isFavorite: true,
    notes: "Met with them on March 15. They have great options for centerpieces.",
  },
  {
    id: 2,
    name: "Dreamy Photography",
    category: "Photographer",
    rating: 4,
    image: "/placeholder.svg?height=200&width=200",
    description: "Capturing your special moments with artistic flair.",
    isFavorite: false,
    notes: "Portfolio looks amazing. Need to discuss package options.",
  },
  {
    id: 3,
    name: "Grand Venue",
    category: "Venue",
    rating: 4,
    image: "/placeholder.svg?height=200&width=200",
    description: "Luxurious wedding venue with stunning views.",
    isFavorite: true,
    notes: "Visited on April 2. Beautiful location but check availability for June.",
  },
  {
    id: 4,
    name: "Sunset Catering",
    category: "Catering",
    rating: 3,
    image: "/placeholder.svg?height=200&width=200",
    description: "Delicious food options for your wedding reception.",
    isFavorite: false,
    notes: "Food tasting scheduled for next month. Ask about dietary restrictions.",
  },
  {
    id: 5,
    name: "Melody Makers",
    category: "Music",
    rating: 5,
    image: "/placeholder.svg?height=200&width=200",
    description: "Live band and DJ services for wedding entertainment.",
    isFavorite: false,
    notes: "Heard them play at Sarah's wedding. Great playlist options.",
  },
  {
    id: 6,
    name: "Sweet Delights Bakery",
    category: "Cake",
    rating: 4,
    image: "/placeholder.svg?height=200&width=200",
    description: "Custom wedding cakes and dessert tables.",
    isFavorite: true,
    notes: "Cake tasting was amazing. Considering the 3-tier option with fondant.",
  },
]

// Initial categories
const initialCategories = [
  "Florist",
  "Photographer",
  "Venue",
  "Catering",
  "Music",
  "Cake",
  "Attire",
  "Invitations",
  "Decorations",
  "Transportation",
  "Videographer",
  "Hair & Makeup",
  "Officiant",
]

export default function VendorsPage() {
  const [vendors, setVendors] = useState(initialVendors)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [vendorNote, setVendorNote] = useState("")
  const [showAddVendor, setShowAddVendor] = useState(false)
  const [categories, setCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState("")
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [viewingVendor, setViewingVendor] = useState(null)

  // Form setup for adding a new vendor
  const form = useForm({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      category: "",
      description: "",
      notes: "",
    },
  })

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const favoriteVendors = vendors.filter((vendor) => vendor.isFavorite)

  const toggleFavorite = (e, id) => {
    e.stopPropagation()
    setVendors(vendors.map((vendor) => (vendor.id === id ? { ...vendor, isFavorite: !vendor.isFavorite } : vendor)))
  }

  const updateRating = (id, newRating) => {
    setVendors(vendors.map((vendor) => (vendor.id === id ? { ...vendor, rating: newRating } : vendor)))
  }

  const saveNote = () => {
    if (selectedVendor && vendorNote) {
      setVendors(vendors.map((vendor) => (vendor.id === selectedVendor.id ? { ...vendor, notes: vendorNote } : vendor)))
      setSelectedVendor(null)
      setVendorNote("")

      toast.success("Note added", {
        description: `Note for ${selectedVendor.name} has been updated.`,
      })
    }
  }

  const onSubmit = (data) => {
    const newVendorWithId = {
      ...data,
      id: vendors.length + 1,
      rating: 0,
      isFavorite: false,
      image: "/placeholder.svg?height=200&width=200",
    }

    setVendors([...vendors, newVendorWithId])
    setShowAddVendor(false)
    form.reset()

    toast.success("Vendor added", {
      description: `${data.name} has been added to your vendors.`,
    })
  }

  const handleViewVendor = (vendor) => {
    setViewingVendor(vendor)
  }

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory])
      form.setValue("category", newCategory)
      setNewCategory("")
      setShowAddCategory(false)

      toast.success("Category added", {
        description: `${newCategory} has been added to categories.`,
      })
    }
  }

  const handleClickOutside = (e) => {
    if (e.target === e.currentTarget) {
      setViewingVendor(null)
    }
  }

  return (
    <AppShell>
      <main className="flex-1">
        <div className="container py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Vendor Management</h1>
              <p className="text-muted-foreground">Manage and organize your wedding vendors</p>
            </div>
            <div className="flex flex-col sm:flex-row w-full items-center gap-2 md:w-auto">
              <div className="relative w-full md:w-[300px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search vendors..."
                  className="w-full pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowAddVendor(true)} className="w-full sm:w-auto">
                Add Vendor
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Vendors</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVendors.map((vendor) => (
                  <Card
                    key={vendor.id}
                    className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => handleViewVendor(vendor)}
                  >
                    <div className="relative">
                      <Image
                        src={vendor.image || "/placeholder.svg"}
                        alt={vendor.name}
                        width={400}
                        height={200}
                        className="h-48 w-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 rounded-full bg-background/80 backdrop-blur-sm"
                        onClick={(e) => toggleFavorite(e, vendor.id)}
                      >
                        <Heart className={`h-5 w-5 ${vendor.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                        <span className="sr-only">Toggle favorite</span>
                      </Button>
                    </div>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{vendor.name}</CardTitle>
                        <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {vendor.category}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 text-sm text-muted-foreground">{vendor.description}</p>
                      <div className="mb-4">
                        <div className="mb-1 text-sm font-medium">Rating</div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Button
                              key={star}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation()
                                updateRating(vendor.id, star)
                              }}
                            >
                              <Star
                                className={`h-5 w-5 ${
                                  star <= vendor.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                              <span className="sr-only">Rate {star} stars</span>
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="mb-1 text-sm font-medium">Notes</div>
                        <p className="text-xs text-muted-foreground">{vendor.notes || "No notes yet"}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVendor(vendor)
                          setVendorNote(vendor.notes)
                        }}
                      >
                        Add Note
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="favorites">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteVendors.length > 0 ? (
                  favoriteVendors.map((vendor) => (
                    <Card
                      key={vendor.id}
                      className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => handleViewVendor(vendor)}
                    >
                      <div className="relative">
                        <Image
                          src={vendor.image || "/placeholder.svg"}
                          alt={vendor.name}
                          width={400}
                          height={200}
                          className="h-48 w-full object-cover"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 rounded-full bg-background/80 backdrop-blur-sm"
                          onClick={(e) => toggleFavorite(e, vendor.id)}
                        >
                          <Heart className={`h-5 w-5 ${vendor.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                          <span className="sr-only">Toggle favorite</span>
                        </Button>
                      </div>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{vendor.name}</CardTitle>
                          <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            {vendor.category}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">{vendor.description}</p>
                        <div className="mb-4">
                          <div className="mb-1 text-sm font-medium">Rating</div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Button
                                key={star}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateRating(vendor.id, star)
                                }}
                              >
                                <Star
                                  className={`h-5 w-5 ${
                                    star <= vendor.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                  }`}
                                />
                                <span className="sr-only">Rate {star} stars</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 text-sm font-medium">Notes</div>
                          <p className="text-xs text-muted-foreground">{vendor.notes || "No notes yet"}</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedVendor(vendor)
                            setVendorNote(vendor.notes)
                          }}
                        >
                          Add Note
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
                    <h3 className="mb-2 text-xl font-medium">No favorite vendors yet</h3>
                    <p className="mb-4 text-muted-foreground">
                      Click the heart icon on any vendor card to add them to your favorites
                    </p>
                    <Button variant="outline" onClick={() => document.querySelector('[value="all"]').click()}>
                      Browse All Vendors
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {selectedVendor && (
            <Dialog
              open={!!selectedVendor}
              onOpenChange={(open) => {
                if (!open) setSelectedVendor(null)
              }}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Note for {selectedVendor.name}</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  <textarea
                    className="h-32 w-full rounded-md border bg-background px-3 py-2"
                    placeholder="Enter your notes here..."
                    value={vendorNote}
                    onChange={(e) => setVendorNote(e.target.value)}
                  ></textarea>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setSelectedVendor(null)}>
                    Cancel
                  </Button>
                  <Button onClick={saveNote}>Save Note</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {viewingVendor && (
            <Dialog
              open={!!viewingVendor}
              onOpenChange={(open) => {
                if (!open) setViewingVendor(null)
              }}
            >
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <div className="flex items-center justify-between mb-4">
                    <DialogTitle className="text-2xl font-bold">{viewingVendor.name}</DialogTitle>
                    <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {viewingVendor.category}
                    </div>
                  </div>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Image
                      src={viewingVendor.image || "/placeholder.svg"}
                      alt={viewingVendor.name}
                      width={400}
                      height={300}
                      className="w-full rounded-md object-cover h-48 md:h-64"
                    />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">{viewingVendor.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Rating</h3>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= viewingVendor.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-2">Notes</h3>
                      <p className="text-muted-foreground">{viewingVendor.notes || "No notes yet"}</p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button onClick={() => setViewingVendor(null)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* Add Vendor Dialog */}
          <Dialog
            open={showAddVendor}
            onOpenChange={(open) => {
              setShowAddVendor(open)
              if (!open) {
                form.reset()
                setShowAddCategory(false)
              }
            }}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Vendor</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter vendor name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        {showAddCategory ? (
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter new category"
                              value={newCategory}
                              onChange={(e) => setNewCategory(e.target.value)}
                              className="flex-1"
                            />
                            <Button onClick={handleAddCategory}>Add</Button>
                            <Button variant="ghost" onClick={() => setShowAddCategory(false)}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger className="flex-1">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button variant="outline" onClick={() => setShowAddCategory(true)}>
                              <Plus className="h-4 w-4 mr-1" /> New
                            </Button>
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter initial notes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-4">
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setShowAddVendor(false)
                        form.reset()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="w-full sm:w-auto">
                      Add Vendor
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </AppShell>
  )
}

