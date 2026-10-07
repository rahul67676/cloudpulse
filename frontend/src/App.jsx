import { useEffect, useState } from "react";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const loadData = async () => {
    try {
      const productsResponse = await fetch("http://localhost:3001/products");
      const productsData = await productsResponse.json();

      const ordersResponse = await fetch("http://localhost:3003/orders");
      const ordersData = await ordersResponse.json();

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error("Failed to load CloudPulse data:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>☁️ CloudPulse</h1>
          <p style={styles.subtitle}>
            Cloud-Native E-Commerce & Order Platform
          </p>
        </div>

        <div style={styles.status}>
          <span style={styles.statusDot}></span>
          All Systems Operational
        </div>
      </header>

      <main style={styles.container}>
        <section style={styles.cards}>
          <div style={styles.card}>
            <h3>Products</h3>
            <strong>{products.length}</strong>
            <p>Available products</p>
          </div>

          <div style={styles.card}>
            <h3>Orders</h3>
            <strong>{orders.length}</strong>
            <p>Total orders</p>
          </div>

          <div style={styles.card}>
            <h3>Services</h3>
            <strong>3</strong>
            <p>User · Product · Order</p>
          </div>

          <div style={styles.card}>
            <h3>Database</h3>
            <strong>MySQL</strong>
            <p>Connected</p>
          </div>
        </section>

        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2>Products</h2>
            <button onClick={loadData}>Refresh</button>
          </div>

          <div style={styles.grid}>
            {products.map((product) => (
              <div key={product.id} style={styles.product}>
                <div style={styles.productIcon}>📱</div>

                <h3>{product.name}</h3>

                <p style={styles.category}>
                  {product.category}
                </p>

                <div style={styles.productBottom}>
                  <strong>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>

                  <span>
                    Stock: {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <h2>Recent Orders</h2>

          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div style={styles.orders}>
              {orders.map((order) => (
                <div key={order.id} style={styles.order}>
                  <div>
                    <strong>Order #{order.id}</strong>
                    <p>
                      User {order.user_id} · Product {order.product_id}
                    </p>
                  </div>

                  <div>
                    <strong>
                      ₹{Number(order.total_amount).toLocaleString("en-IN")}
                    </strong>
                    <span style={styles.badge}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f4f7fb",
    color: "#172033",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    background: "#101828",
    color: "white",
    padding: "28px 7%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  logo: {
    margin: 0,
    fontSize: "32px",
  },

  subtitle: {
    margin: "8px 0 0",
    color: "#aab4c5",
  },

  status: {
    background: "#18253a",
    padding: "10px 16px",
    borderRadius: "20px",
    fontSize: "14px",
  },

  statusDot: {
    display: "inline-block",
    width: "9px",
    height: "9px",
    background: "#22c55e",
    borderRadius: "50%",
    marginRight: "8px",
  },

  container: {
    width: "86%",
    maxWidth: "1200px",
    margin: "35px auto",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "white",
    padding: "24px",
    borderRadius: "14px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  },

  section: {
    background: "white",
    marginTop: "30px",
    padding: "25px",
    borderRadius: "14px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.06)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "20px",
  },

  product: {
    border: "1px solid #e5e7eb",
    padding: "20px",
    borderRadius: "12px",
  },

  productIcon: {
    fontSize: "38px",
  },

  category: {
    color: "#667085",
  },

  productBottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },

  orders: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  order: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e5e7eb",
    padding: "16px",
    borderRadius: "10px",
  },

  badge: {
    display: "block",
    marginTop: "5px",
    background: "#dcfce7",
    color: "#166534",
    padding: "4px 8px",
    borderRadius: "5px",
    fontSize: "12px",
  },
};

export default App;
