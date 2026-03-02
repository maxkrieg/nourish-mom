import { OrderProvider } from '@/components/order/OrderContext'

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return <OrderProvider>{children}</OrderProvider>
}
