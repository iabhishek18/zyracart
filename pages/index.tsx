"use client"


import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform, useSpring } from "framer-motion"
import { ShoppingCart, X, Plus, Minus, Sun, Moon, Star, StarHalf, Menu, Search } from "lucide-react"
import Head from "next/head"
import { Playfair_Display, Quicksand } from "next/font/google"


// Import decorative fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})


const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-quicksand",
})


// Types
interface Product {
  id: number
  name: string
  price: number
  rating: number
  image: string
  category: string
}


interface CartItem extends Product {
  quantity: number
}


// Sample product data
const products: Product[] = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: 129.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500&auto=format&fit=crop",
    category: "Audio",
  },
  {
    id: 2,
    name: "Ultra HD Smart Watch",
    price: 199.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500&auto=format&fit=crop",
    category: "Wearables",
  },
  {
    id: 3,
    name: "Portable Power Bank 20000mAh",
    price: 49.99,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=500&auto=format&fit=crop",
    category: "Accessories",
  },
  {
    id: 4,
    name: "Noise Cancelling Headphones",
    price: 249.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop",
    category: "Audio",
  },
  {
    id: 5,
    name: "Wireless Charging Pad",
    price: 39.99,
    rating: 4.2,
    image:
      "https://images.unsplash.com/photo-1633381638729-27f730955c23?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Accessories",
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 89.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=500&auto=format&fit=crop",
    category: "Audio",
  },
  {
    id: 7,
    name: "Smartphone Gimbal Stabilizer",
    price: 119.99,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1638243292863-3744d6a7e021?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Photography",
  },
  {
    id: 8,
    name: "Ultra-Slim Laptop Sleeve",
    price: 29.99,
    rating: 4.1,
    image:
      "https://images.unsplash.com/photo-1585789574224-8cbf3247e581?q=80&w=1931&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Accessories",
  },
]


// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}


const slideUp = {
  hidden: { y: 50, opacity: 0 },
  visible: { y: 0, opacity: 1 },
}


const slideRight = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
}


const slideLeft = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1 },
}


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}


const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
}


const popUp = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 25,
    },
  },
}


const cardElementFadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
}


const cardElementsContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}


const imageReveal = {
  hidden: { scale: 1.2, opacity: 0.5 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}


// Utility for the magnetic button effect
const useMagneticEffect = (strength = 25) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)


  const handleMouse = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2


      // Calculate distance from center
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY


      // Apply magnetic effect
      x.set(distanceX / strength)
      y.set(distanceY / strength)
    },
    [x, y, strength],
  )


  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])


  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)


  return {
    ref,
    x: springX,
    y: springY,
    handleMouse,
    handleMouseLeave,
  }
}


// Add a custom hook for the 3D tilt effect
const useTiltEffect = (tiltStrength = 15) => {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)


  const rotateX = useTransform(y, [-300, 300], [tiltStrength, -tiltStrength])
  const rotateY = useTransform(x, [-300, 300], [-tiltStrength, tiltStrength])


  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()


      // Calculate position relative to the center of the element
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2


      x.set(e.clientX - centerX)
      y.set(e.clientY - centerY)
    },
    [x, y],
  )


  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])


  return { ref, rotateX, rotateY, handleMouseMove, handleMouseLeave }
}


// Add a custom hook for the cart shake animation
const useShakeAnimation = () => {
  const controls = useAnimation()


  const shake = async () => {
    await controls.start({
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.4, ease: "easeInOut" },
    })
  }


  return { controls, shake }
}


// Add a reveal mask animation variant
const revealVariants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.8,
      ease: "easeInOut",
      delay: 0.2,
    },
  },
}


// Custom hook to detect device type
const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }


    // Initial check
    handleResize()


    // Add event listener
    window.addEventListener("resize", handleResize)


    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  return { isMobile, isTablet }
}


// Loading component
function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 z-50">
      <div className="text-center">
        <motion.div
          className="flex items-center justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            ZyraCart
          </h1>
        </motion.div>


        <div className="relative w-16 h-16 mx-auto">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 opacity-75"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />


          <motion.div
            className="absolute inset-2 rounded-full bg-white dark:bg-gray-800"
            animate={{
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />


          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
          </motion.div>
        </div>


        <motion.p
          className="mt-4 text-gray-600 dark:text-gray-300 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Loading amazing tech...
        </motion.p>
      </div>
    </div>
  )
}


// Add this component definition at the top level, outside the Home component:
function ProductCard({
  product,
  darkMode,
  addToCart,
  isMobile,
}: {
  product: Product
  darkMode: boolean
  addToCart: (product: Product) => void
  isMobile: boolean
}) {
  const tilt = useTiltEffect(10)
  const magnetic = useMagneticEffect(15)


  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0


    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    )
  }


  // Create a direct handler for the add to cart button
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }


  return (
    <motion.div
      variants={scaleUp}
      whileHover={
        !isMobile
          ? {
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              transition: { duration: 0.2 },
            }
          : {}
      }
      ref={!isMobile ? tilt.ref : undefined}
      onMouseMove={!isMobile ? tilt.handleMouseMove : undefined}
      onMouseLeave={!isMobile ? tilt.handleMouseLeave : undefined}
      style={
        !isMobile
          ? {
              rotateX: tilt.rotateX,
              rotateY: tilt.rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }
          : {}
      }
      className={`rounded-lg overflow-hidden shadow-md transition-all flex flex-col h-full ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <motion.div
        className="relative h-48 overflow-hidden flex-shrink-0 product-card-image"
        whileHover={!isMobile ? { scale: 1.02 } : {}}
        transition={{ duration: 0.3 }}
      >
        <motion.div initial="hidden" animate="visible" variants={revealVariants} className="h-full w-full">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform hover:scale-110 duration-700"
            unoptimized
          />
        </motion.div>
        <motion.div
          className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {product.category}
        </motion.div>
      </motion.div>
      <div className="p-4 flex flex-col flex-grow" style={!isMobile ? { transform: "translateZ(20px)" } : {}}>
        <motion.h3
          className={`product-title text-lg mb-1 line-clamp-1 relative z-10 font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          whileHover={!isMobile ? { color: "#9333ea", x: 2 } : {}}
        >
          {product.name}
        </motion.h3>
        <motion.div
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <motion.span
            className={`price-text ${darkMode ? "text-purple-400" : "text-purple-600"}`}
            whileHover={!isMobile ? { scale: 1.1, x: 2 } : {}}
            transition={{ type: "spring", stiffness: 400 }}
          >
            ${product.price.toFixed(2)}
          </motion.span>
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            whileHover={!isMobile ? { scale: 1.1 } : {}}
          >
            {renderRating(product.rating)}
          </motion.div>
        </motion.div>
        <div className="mt-auto pt-2">
          <button
            onClick={handleAddToCart}
            className="button-text w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 md:py-3 rounded-md hover:opacity-90 transition-all flex items-center justify-center group active:opacity-70 touch-manipulation"
          >
            <span className="inline-flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}


export default function Home() {
  // Device detection
  const { isMobile, isTablet } = useDeviceDetect()


  // Add this at the beginning of the component to initialize the cart shake controls
  const cartShakeControls = useShakeAnimation()
  // State management
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [activeCategory, setActiveCategory] = useState("All")
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [orderTotal, setOrderTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)


  // Handle page reload
  const handleReloadPage = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }


  // Simulate loading on initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)


    return () => clearTimeout(timer)
  }, [])


  // Add scroll functionality for "Shop Now" button
  const productSectionRef = useRef<HTMLElement>(null)
  const scrollToProducts = () => {
    if (productSectionRef.current) {
      const yOffset = -60 // Adjust this value as needed to account for the header
      const y = productSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }


  // Calculate cart total
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)


  // Filter products based on search query and category
  useEffect(() => {
    let result = products


    if (searchQuery) {
      result = result.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))


      // Add a small delay before scrolling to ensure the filtering is complete
      setTimeout(() => {
        // Scroll to products section when user searches
        if (productSectionRef.current) {
          const yOffset = -60
          const y = productSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }, 100)


      // Close mobile menu after search on mobile
      if (isMobile && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }


    if (activeCategory !== "All") {
      result = result.filter((product) => product.category === activeCategory)
    }


    setFilteredProducts(result)
  }, [searchQuery, activeCategory, isMobile, mobileMenuOpen])


  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])


  // Add to cart function
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)


      if (existingItem) {
        return prevCart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })


    // Trigger the shake animation
    cartShakeControls.shake()
  }


  // Remove from cart function
  const removeFromCart = (id: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === id)


      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
      } else {
        return prevCart.filter((item) => item.id !== id)
      }
    })
  }


  // Delete item from cart
  const deleteFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }


  // Render star ratings
  const renderRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0


    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + (hasHalfStar ? 1 : 0)} className="w-4 h-4 text-gray-300" />
        ))}
      </div>
    )
  }


  // Add a custom hook for intersection observer
  function useInView(options = {}) {
    const ref = useRef(null)
    const [isInView, setIsInView] = useState(false)
    const controls = useAnimation()


    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        setIsInView(entry.isIntersecting)
        if (entry.isIntersecting) {
          controls.start("visible")
        }
      }, options)


      if (ref.current) {
        observer.observe(ref.current)
      }


      return () => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      }
    }, [controls, options])


    return { ref, isInView, controls }
  }


  // Get unique categories
  const categories = ["All", ...Array.from(new Set(products.map((product) => product.category)))]


  // Handle checkout function - now directly shows success message
  const handleCheckout = () => {
    // Store the total before clearing the cart
    const finalTotal = cartTotal


    // Show success message with the correct total
    setCheckoutSuccess(true)
    setOrderTotal(finalTotal)


    // Clear cart and close cart sidebar
    setCart([])
    setIsCartOpen(false)


    // Hide success message after 3 seconds
    setTimeout(() => {
      setCheckoutSuccess(false)
    }, 3000)
  }


  // Add footer link functionality
  const handleFooterLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    alert("This would navigate to the selected page in a complete implementation.")
  }


  // Handle category selection
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category)


    // Scroll to products section after category selection
    setTimeout(() => {
      if (productSectionRef.current) {
        const yOffset = -60
        const y = productSectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: "smooth" })
      }
    }, 100)
  }


  // Handle cart open
  const handleCartOpen = () => {
    setIsCartOpen(true)
    cartShakeControls.shake()
  }


  if (isLoading) {
    return <Loading />
  }


  return (
    <>
      <Head>
        <title>ZyraCart - Premium Tech Gadgets</title>
        <meta
          name="description"
          content="Discover the latest innovations in tech with our premium selection of gadgets and accessories."
        />
      </Head>


      <style jsx global>{`
        /* Font settings */
        :root {
          --font-playfair: "Playfair Display", Georgia, serif;
          --font-quicksand: "Quicksand", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
            Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }


        body {
          font-family: var(--font-quicksand);
        }


        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          font-family: var(--font-playfair);
        }


        .logo-text {
          font-family: var(--font-playfair);
          letter-spacing: 0.05em;
        }


        .product-title {
          font-family: var(--font-playfair);
          font-weight: 600;
        }


        .price-text {
          font-family: var(--font-playfair);
          font-weight: 700;
        }


        .button-text {
          font-family: var(--font-quicksand);
          font-weight: 600;
          letter-spacing: 0.03em;
        }


        /* Custom background pattern */
        .bg-grid-pattern {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 20px 20px;
        }


        /* Animated gradient background */
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }


        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }


        /* Floating animation */
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }


        .animate-float {
          animation: float 3s ease-in-out infinite;
        }


        /* Pulse animation */
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }


        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }


        /* Line clamp for text truncation */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }


        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }


        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }


        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }


        ::-webkit-scrollbar-thumb {
          background: rgba(124, 58, 237, 0.5);
          border-radius: 10px;
        }


        ::-webkit-scrollbar-thumb:hover {
          background: rgba(124, 58, 237, 0.7);
        }


        /* Dark mode adjustments */
        .dark ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }


        .dark ::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.5);
        }


        .dark ::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.7);
        }


        /* Add these styles to improve text visibility in dark mode */
        .dark .product-title {
          color: white;
          text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.6);
        }


        .dark .price-text {
          color: rgb(192, 132, 252); /* purple-300 */
          text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
        }


        /* Add a semi-transparent overlay to product images in dark mode for better text contrast */
        .dark .product-card-image::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%);
          pointer-events: none;
        }


        /* Improve card contrast in dark mode */
        .dark .bg-gray-800 {
          background-color: rgb(31, 41, 55); /* Slightly adjusted gray-800 for better contrast */
        }


        /* Ensure category badges are visible */
        .dark .bg-purple-600 {
          background-color: rgb(147, 51, 234); /* purple-600 */
        }


        /* Improve rating stars visibility in dark mode */
        .dark .text-gray-300 {
          color: rgb(209, 213, 219); /* gray-300 */
        }


        /* Category buttons container */
        .category-scroll-container {
          display: flex;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding: 0.5rem 0;
          margin: 0 -0.25rem;
        }


        .category-scroll-container::-webkit-scrollbar {
          display: none;
        }


        .category-button {
          flex: 0 0 auto;
          white-space: nowrap;
          margin: 0 0.25rem;
        }


        /* Footer styles */
        .footer-container {
          padding: 1.5rem 1rem;
        }


        .footer-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }


        .footer-logo {
          margin-bottom: 0.5rem;
        }


        .footer-copyright {
          margin-bottom: 1.5rem;
        }


        .footer-social {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }


        @media (min-width: 768px) {
          .footer-content {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }


          .footer-copyright {
            margin-bottom: 0;
          }
        }


        /* Mobile touch improvements */
        @media (max-width: 768px) {
          /* Increase touch target size */
          button,
          a {
            min-height: 44px;
            min-width: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
          }


          /* Hide scrollbar on mobile for category filters */
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }


          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }


          /* Improve tap feedback */
          button:active,
          a:active {
            opacity: 0.7;
            transform: scale(0.97);
            transition: transform 0.1s ease-in-out, opacity 0.1s ease-in-out;
          }


          /* Ensure touch events work properly */
          .touch-manipulation {
            touch-action: manipulation;
          }


          /* Fix for iOS Safari button issues */
          button {
            -webkit-tap-highlight-color: transparent;
            cursor: pointer;
          }


          /* Ensure buttons have proper hit areas */
          .category-buttons {
            padding: 0.5rem 0;
            display: flex;
            gap: 0.5rem;
          }


          /* Ensure cart buttons have proper spacing */
          .cart-buttons button {
            margin: 0 0.25rem;
          }


          /* Mobile font size adjustments */
          .product-title {
            font-size: 0.95rem;
            line-height: 1.3;
          }


          .price-text {
            font-size: 0.95rem;
          }


          .button-text {
            font-size: 0.9rem;
          }


          /* Mobile spacing fixes */
          .mobile-cart-item {
            padding: 0.75rem !important;
          }


          .mobile-cart-buttons {
            display: flex;
            align-items: center;
            justify-content: center;
          }


          .mobile-cart-buttons button {
            padding: 0.5rem !important;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
          }
          
          .mobile-cart-buttons span {
            text-align: center;
            min-width: 20px;
          }
        }


        /* 3D Cube Styles */
        .perspective {
          perspective: 1000px;
        }


        .preserve-3d {
          transform-style: preserve-3d;
        }


        @media (max-width: 768px) {
          .preserve-3d {
            transform: scale(0.85);
          }
        }


        /* Social icon styles */
        .social-icon-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }


        .social-icon-link:hover {
          transform: translateY(-3px);
          background-color: rgba(255, 255, 255, 0.1);
        }


        .social-icon {
          width: 24px;
          height: 24px;
        }


        /* Ensure social icons are visible in both modes */
        .dark .social-icon-link {
          background-color: rgba(255, 255, 255, 0.05);
        }


        .dark .social-icon-link:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
      `}</style>


      <div className={`${playfair.variable} ${quicksand.variable}`}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.5 }}
          className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}
        >
          {/* Header */}
          <motion.header
            variants={slideUp}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className={`sticky top-0 z-50 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}
          >
            <div className="container mx-auto px-4 py-3 md:py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <motion.div
                  className="flex items-center space-x-2 cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={handleReloadPage}
                >
                  <h1 className="logo-text text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    ZyraCart
                  </h1>
                </motion.div>


                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-6">
                  <motion.div
                    className="relative"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <input
                      type="text"
                      placeholder="Search products..."
                      className={`pl-10 pr-4 py-2 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                        darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                  </motion.div>


                  {/* Theme Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-full transition-colors flex items-center justify-center ${
                      darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"
                    }`}
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.button>


                  {/* Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCartOpen}
                    className="relative p-2 rounded-full bg-purple-600 text-white"
                    aria-label="Open cart"
                    animate={cartShakeControls.controls}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cart.length > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </motion.span>
                    )}
                  </motion.button>
                </div>


                {/* Mobile Menu Button */}
                <div className="flex items-center space-x-3 md:hidden">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-full flex items-center justify-center ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"} active:opacity-70`}
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>


                  {/* Cart Button */}
                  <button
                    onClick={handleCartOpen}
                    className="relative p-2 rounded-full bg-purple-600 text-white active:bg-purple-700 flex items-center justify-center"
                    aria-label="Open cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cart.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    )}
                  </button>


                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`p-2 rounded-md ${darkMode ? "bg-gray-700" : "bg-gray-200"} active:bg-opacity-80 flex items-center justify-center`}
                    aria-label="Open menu"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                </div>
              </div>


              {/* Mobile Search */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 md:hidden overflow-hidden"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search products..."
                        className={`pl-10 pr-4 py-2 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                          darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>


          {/* Main Content */}
          <main className="container mx-auto px-4 py-6 md:py-8">
            {/* Hero Section */}
            <motion.section
              variants={scaleUp}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={`mb-8 md:mb-12 rounded-2xl overflow-hidden relative ${
                darkMode
                  ? "bg-gradient-to-r from-gray-800 to-gray-900"
                  : "bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100"
              }`}
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse"></div>


              <motion.div
                className="p-6 md:p-12 flex flex-col md:flex-row items-center relative z-10"
                variants={staggerContainer}
              >
                <motion.div className="md:w-1/2 mb-6 md:mb-0" variants={slideRight}>
                  <motion.h2 variants={slideUp} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                      Next-Gen Tech Gadgets
                    </span>
                  </motion.h2>


                  <motion.p
                    variants={slideUp}
                    className={`mb-6 text-sm md:text-base ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Discover the latest innovations in tech with our premium selection of gadgets and accessories.
                  </motion.p>


                  <button
                    onClick={scrollToProducts}
                    className="button-text bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 md:px-5 py-2 md:py-3 rounded-full transition-all text-sm md:text-base active:opacity-80"
                  >
                    Shop Now
                  </button>
                </motion.div>


                <motion.div className="md:w-1/2 flex justify-center" variants={slideLeft}>
                  <motion.div
                    className="relative w-full max-w-xs md:max-w-sm perspective"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      opacity: { duration: 0.6 },
                      scale: { duration: 0.6 },
                    }}
                    style={{ perspective: "1000px" }}
                  >
                    {/* 3D Cube */}
                    <motion.div
                      className="w-[200px] h-[200px] md:w-[220px] md:h-[220px] mx-auto relative preserve-3d"
                      animate={{
                        rotateY: [0, 360],
                        rotateX: [0, 15, 0, -15, 0],
                      }}
                      transition={{
                        rotateY: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 10,
                          ease: "linear",
                        },
                        rotateX: {
                          repeat: Number.POSITIVE_INFINITY,
                          duration: 5,
                          ease: "easeInOut",
                        },
                      }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* Front Face */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
                        style={{ transform: "translateZ(100px)", backfaceVisibility: "hidden" }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=500&auto=format&fit=crop"
                          alt="Headphones"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>


                      {/* Back Face */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
                        style={{ transform: "rotateY(180deg) translateZ(100px)", backfaceVisibility: "hidden" }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=500&auto=format&fit=crop"
                          alt="Smart Watch"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>


                      {/* Right Face */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
                        style={{ transform: "rotateY(90deg) translateZ(100px)", backfaceVisibility: "hidden" }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?q=80&w=500&auto=format&fit=crop"
                          alt="Wireless Earbuds"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>


                      {/* Left Face */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
                        style={{ transform: "rotateY(-90deg) translateZ(100px)", backfaceVisibility: "hidden" }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=500&auto=format&fit=crop"
                          alt="Bluetooth Speaker"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>


                      {/* Top Face */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
                        style={{ transform: "rotateX(90deg) translateZ(100px)", backfaceVisibility: "hidden" }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1638243292863-3744d6a7e021?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                          alt="Smartphone Gimbal"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>


                      {/* Bottom Face */}
                      <div
                        className="absolute inset-0 w-full h-full rounded-lg shadow-lg overflow-hidden"
                        style={{ transform: "rotateX(-90deg) translateZ(100px)", backfaceVisibility: "hidden" }}
                      >
                        <Image
                          src="https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?q=80&w=500&auto=format&fit=crop"
                          alt="Power Bank"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </motion.div>


                    {/* Subtle glow effect without the card background */}
                    <motion.div
                      className="absolute -inset-2 rounded-xl opacity-30 blur-lg"
                      style={{
                        background: "linear-gradient(45deg, rgba(168, 85, 247, 0.4), rgba(236, 72, 153, 0.4))",
                        zIndex: -1,
                      }}
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    ></motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.section>


            {/* Category Filter */}
            <motion.section variants={slideUp} transition={{ delay: 0.8, duration: 0.5 }} className="mb-6 md:mb-8">
              <div className="category-scroll-container">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={`button-text category-button px-3 md:px-4 py-2 md:py-3 rounded-full whitespace-nowrap transition-colors text-sm ${
                      activeCategory === category
                        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white"
                        : darkMode
                          ? "bg-gray-700 text-gray-200 hover:bg-gray-600 active:bg-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-300"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </motion.section>


            {/* Products Grid */}
            <motion.section
              ref={productSectionRef}
              className="mb-8 md:mb-12"
              variants={fadeIn}
              transition={{ duration: 0.5, delay: 1 }}
            >
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className={`text-center py-10 md:py-16 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4 md:mb-6 p-4 md:p-6 rounded-full bg-gray-100 dark:bg-gray-700"
                  >
                    <Search className="w-8 h-8 md:w-12 md:h-12 text-gray-400" />
                  </motion.div>
                  <h3 className="text-xl md:text-2xl font-medium mb-2">No products found</h3>
                  <p className="max-w-md mx-auto text-sm md:text-base">
                    We couldn't find any products matching "{searchQuery}". Try adjusting your search or browse our
                    categories.
                  </p>
                  <button
                    onClick={() => setSearchQuery("")}
                    className="button-text mt-4 md:mt-6 px-4 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors text-sm md:text-base active:bg-purple-800"
                  >
                    Clear Search
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      darkMode={darkMode}
                      addToCart={addToCart}
                      isMobile={isMobile}
                    />
                  ))}
                </div>
              )}
            </motion.section>
          </main>


          {/* Footer */}
          <motion.footer
            className={`py-6 md:py-8 ${darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-700"} footer-container`}
            variants={slideUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="container mx-auto px-4">
              <div className="footer-content">
                <div className="footer-logo">
                  <h2
                    className="logo-text text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent cursor-pointer"
                    onClick={handleReloadPage}
                  >
                    ZyraCart
                  </h2>
                  <p className="footer-copyright text-xs md:text-sm mt-1">© 2023 ZyraCart. All rights reserved.</p>
                </div>
                <div className="footer-social">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-icon-link ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
                    aria-label="Instagram"
                  >
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
                      className="social-icon"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                  </a>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-icon-link ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
                    aria-label="Facebook"
                  >
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
                      className="social-icon"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`social-icon-link ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
                    aria-label="WhatsApp"
                  >
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
                      className="social-icon"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    </svg>
                  </a>
                  <a
                    href="mailto:info@zyracart.com"
                    className={`social-icon-link ${darkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"}`}
                    aria-label="Email"
                  >
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
                      className="social-icon"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </motion.footer>


          {/* Cart Sidebar */}
          <AnimatePresence>
            {isCartOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black z-50"
                  onClick={() => setIsCartOpen(false)}
                />


                {/* Cart Panel */}
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className={`fixed top-0 right-0 h-full w-full sm:w-96 z-50 shadow-xl ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                >
                  <div className="flex flex-col h-full">
                    {/* Cart Header */}
                    <div className="p-4 border-b flex items-center justify-between">
                      <h2 className="logo-text text-lg md:text-xl font-bold">Your Cart</h2>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        aria-label="Close cart"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>


                    {/* Cart Items */}
                    <div className="flex-grow overflow-y-auto p-4">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <ShoppingCart className="w-12 h-12 md:w-16 md:h-16 text-gray-400 mb-4" />
                          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm md:text-base`}>
                            Your cart is empty
                          </p>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="button-text mt-6 bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 md:px-5 py-2 md:py-3 rounded-full font-medium text-sm md:text-base active:opacity-80"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      ) : (
                        <ul className="space-y-3 md:space-y-4">
                          {cart.map((item) => (
                            <li
                              key={item.id}
                              className={`flex items-center p-2 md:p-3 rounded-lg mobile-cart-item ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}
                            >
                              <div className="relative w-12 h-12 md:w-16 md:h-16 rounded overflow-hidden mr-2 md:mr-4">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-grow min-w-0">
                                <h4 className="product-title text-sm md:text-base truncate">{item.name}</h4>
                                <p
                                  className={`price-text ${darkMode ? "text-purple-400" : "text-purple-600"} text-sm md:text-base`}
                                >
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                              <div className="flex items-center cart-buttons mobile-cart-buttons">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className={`p-1 md:p-2 rounded-full flex items-center justify-center ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"} active:bg-opacity-70 touch-manipulation`}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <span className="mx-1 md:mx-2 min-w-[20px] text-center text-sm md:text-base flex items-center justify-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => addToCart(item)}
                                  className={`p-1 md:p-2 rounded-full flex items-center justify-center ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"} active:bg-opacity-70 touch-manipulation`}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                                <button
                                  onClick={() => deleteFromCart(item.id)}
                                  className={`ml-1 md:ml-2 p-1 md:p-2 rounded-full flex items-center justify-center text-red-500 ${darkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"} active:bg-opacity-70 touch-manipulation`}
                                  aria-label="Remove item"
                                >
                                  <X className="w-3 h-3 md:w-4 md:h-4" />
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>


                    {/* Cart Footer */}
                    {cart.length > 0 && (
                      <div className={`p-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Subtotal:</span>
                          <span className="price-text">${cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                          onClick={handleCheckout}
                          className="button-text w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 md:py-3 rounded-md font-medium hover:opacity-90 active:opacity-80 transition-all text-sm md:text-base"
                        >
                          Checkout
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>


          {/* Success Toast */}
          <AnimatePresence>
            {checkoutSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg shadow-lg z-50 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 md:h-6 md:w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-medium text-sm md:text-base">Order confirmed!</p>
                  <p className="text-xs md:text-sm">Total: ${orderTotal.toFixed(2)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  )
}