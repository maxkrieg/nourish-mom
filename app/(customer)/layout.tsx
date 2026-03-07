import Footer from '@/components/customer/Footer'
import { OrderProvider } from '@/components/order/OrderContext'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OrderProvider>
      {children}
      <Footer />
    </OrderProvider>
  )
}
