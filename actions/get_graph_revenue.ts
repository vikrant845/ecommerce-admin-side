import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true
    },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    }
  });

  const monthlyRevenue: { [key: number]: number } = {};

  paidOrders.forEach(order => {
    let revenueForMonth = 0;
    const month = order.createdAt.getMonth();
    const items = order.orderItems;

    items.forEach(item => revenueForMonth += item.product.price);

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueForMonth;
  });

  const graphData: GraphData[] = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];

  for(let month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
}

export default getGraphRevenue;