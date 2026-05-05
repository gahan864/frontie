import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, RefreshCcw, CreditCard, ArrowRightLeft, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import API from "../services/api";

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWallet = async () => {
      setLoading(true);
      try {
        const res = await API.get("/wallet/1");
        setWallet(res.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          alert("Unauthorized. Please login again.");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="wallet-container">
      <motion.div 
        className="wallet-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1>My Wallet</h1>
          <p>Welcome back, manage your finances</p>
        </div>
        
        <motion.button 
          className="btn-primary" 
          style={{ width: 'auto', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-color)' }}
          onClick={handleLogout}
          whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', borderColor: 'var(--error-color)' }}
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="balance-card">
          <div className="balance-label">Total Balance</div>
          <div className="balance-amount">
            <span style={{ fontSize: '2rem', opacity: 0.8 }}>$</span>
            {loading ? (
              <RefreshCcw className="spinner" size={32} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              wallet?.balance?.toFixed(2) || "0.00"
            )}
          </div>
          
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <motion.button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.2)' }} whileHover={{ scale: 1.05 }}>
              <ArrowDownLeft size={18} /> Receive
            </motion.button>
            <motion.button className="btn-primary" style={{ flex: 1, background: 'rgba(255,255,255,0.2)' }} whileHover={{ scale: 1.05 }}>
              <ArrowUpRight size={18} /> Send
            </motion.button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 style={{ marginBottom: '16px', marginTop: '32px' }}>Quick Actions</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            
            <motion.div className="glass-panel" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} whileHover={{ y: -5 }}>
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary-color)' }}>
                <CreditCard size={24} />
              </div>
              <h4>Add Money</h4>
              <p style={{ fontSize: '0.875rem' }}>Top up your wallet</p>
            </motion.div>

            <motion.div className="glass-panel" style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }} whileHover={{ y: -5 }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--success-color)' }}>
                <ArrowRightLeft size={24} />
              </div>
              <h4>Transfer</h4>
              <p style={{ fontSize: '0.875rem' }}>Send to another user</p>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Wallet;