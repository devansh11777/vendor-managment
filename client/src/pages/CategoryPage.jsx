import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { ProductCard } from '../components/ProductCard';

export const CategoryPage = () => {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [lastSync, setLastSync] = useState(new Date());

  const categoryTitles = {
    'personal-care': 'Personal Care & Daily Essentials',
    'food': 'Campus Canteens & Food Outlets',
    'stationary': 'Books, Stationary & Academic Supplies',
    'all': 'All Campus Vendor Products'
  };

  const fetchProducts = async () => {
    try {
      let url = '/api/products';
      const params = new URLSearchParams();

      if (category && category !== 'all') {
        params.append('category', category);
      }
      if (searchParam) {
        params.append('search', searchParam);
      }
      if (sortBy === 'price_asc') {
        params.append('sortBy', 'price_asc');
      } else if (sortBy === 'price_desc') {
        params.append('sortBy', 'price_desc');
      }

      const queryString = params.toString();
      if (queryString) url += `?${queryString}`;

      const res = await axios.get(url);
      setProducts(res.data);
      setLastSync(new Date());
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchProducts();

    // Real-time synchronization: poll every 12 seconds for live inventory and discounts
    const interval = setInterval(() => {
      fetchProducts();
    }, 12000);

    return () => clearInterval(interval);
  }, [category, searchParam, sortBy]);

  const filteredProducts = products.filter((p) => {
    if (inStockOnly && !p.inStock) return false;
    return true;
  });

  // Calculate lowest price for similar named items to offer smart price comparison
  const priceComparisonMap = {};
  filteredProducts.forEach((p) => {
    const key = p.name.trim().toLowerCase();
    const effectivePrice = p.discountedPrice || p.price;
    if (!priceComparisonMap[key] || effectivePrice < priceComparisonMap[key]) {
      priceComparisonMap[key] = effectivePrice;
    }
  });

  return (
    <div style={{ paddingTop: '62px', minHeight: '100vh', backgroundColor: '#fbfbfd' }}>
      <Navbar />

      <main style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Category Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '1.5rem',
          borderBottom: '2px solid #f0f0f0',
          paddingBottom: '1rem',
          flexWrap: 'wrap',
          gap: '15px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#222',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <span>{categoryTitles[category] || 'Campus Store'}</span>
              {searchParam && (
                <span style={{ fontSize: '18px', fontWeight: '400', color: '#666' }}>
                  (Matching: "{searchParam}")
                </span>
              )}
            </h1>
            <p style={{ color: '#777', fontSize: '14px', marginTop: '4px' }}>
              Real-time stock and prices directly from hostel shops and campus vendors.
            </p>
          </div>

          {/* Sync badge indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#e8f5e9',
            color: '#2e7d32',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#2e7d32',
              display: 'inline-block'
            }}></span>
            Live Synced ({lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })})
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Availability checkbox */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ width: '17px', height: '17px', accentColor: '#f58220', cursor: 'pointer' }}
            />
            Show In-Stock Only
          </label>

          {/* Sort selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', color: '#555', fontWeight: '500' }}>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                backgroundColor: '#fff',
                fontSize: '13px',
                color: '#333',
                cursor: 'pointer'
              }}
            >
              <option value="default">Featured / Newest</option>
              <option value="price_asc">Price: Low to High ₹</option>
              <option value="price_desc">Price: High to Low ₹</option>
            </select>
          </div>
        </div>

        {/* Products Grid (4 columns desktop, 2 tablet, 1 mobile) */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>� �</div>
            <p>Loading live campus products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}></span>
            <h3 style={{ color: '#333', marginBottom: '8px' }}>No products found</h3>
            <p style={{ color: '#777', fontSize: '14px' }}>
              Try adjusting your search or filters to see available campus vendor items.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))'
          }}>
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
