import { formatter } from "@/lib/utils";
import { OrderColumn } from "./[orderId]/components/columns";
import BillboardClient from "./components/client";
import prismadb from "@/lib/prismadb";
import moment from 'moment';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {

  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedOrders: OrderColumn[] = orders.map(order => ({
    phone: order.phone,
    address: order.address,
    products: order.orderItems.map(orderItem => orderItem.product.name).join(', '),
    totalPrice: formatter.format(order.orderItems.reduce((total, orderItem) => total + Number(orderItem.product.price), 0)),
    createdAt: moment(order.createdAt).format('MMMM Do YYYY'),
    isPaid: order.isPaid,
    id: order.id
  }));
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={ formattedOrders } />
      </div>
    </div>
  );
}

export default OrdersPage;