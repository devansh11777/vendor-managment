import { PriceComparisonModal } from '../components/PriceComparisonModal';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Navbar } from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { DiscountBadge } from '../components/DiscountBadge';
import toast from 'react-hot-toast';

export const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [moreFromShop, setMoreFromShop] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setActiveImageIndex(0);

        // Fetch other items from this vendor / shop
        if (res.data.vendor?._id) {
          const shopRes = await axios.get(`/api/products?vendor=${res.data.vendor._id}`);
          setMoreFromShop(shopRes.data.filter((p) => p._id !== id).slice(0, 5));
        }

        // Fetch related products in the same category
        if (res.data.category) {
          const relatedRes = await axios.get(`/api/products/category/${res.data.category}`);
          setRelatedProducts(relatedRes.data.filter((p) => p._id !== id).slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load product', err);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ paddingTop: '80px', textAlign: 'center', minHeight: '100vh' }}>
        <Navbar />
        <p style={{ marginTop: '50px', fontSize: '18px', color: '#666' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ paddingTop: '80px', textAlign: 'center', minHeight: '100vh' }}>
        <Navbar />
        <p style={{ marginTop: '50px', fontSize: '18px', color: '#666' }}>Product not found.</p>
        <Link to="/" style={{ color: '#f58220', fontWeight: 'bold' }}>�  Back to Home</Link>
      </div>
    );
  }

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'];

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handleCheckoutNow = () => {
    if (product.inStock) {
      addToCart(product, 1);
      navigate('/cart');
    }
  };

  const isDiscounted = product.discountedPrice && product.discountedPrice < product.price;

  return (
    <div style={{ paddingTop: '62px', minHeight: '100vh', backgroundColor: '#fff' }}>
      <Navbar />

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Main Product Section */}
        <section style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '40px',
          marginBottom: '50px'
        }}>
          {/* Left: Product Image & Navigation  */}
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '460px',
            height: '520px',
            backgroundColor: '#f5f5f7',
            borderRadius: '16px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            {images.length > 1 && (
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '22px',
                  padding: '8px 14px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                &#10094;
              </button>
            )}

            <img
              src={images[activeImageIndex]}
              alt={product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '20px'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop';
              }}
            />

            {images.length > 1 && (
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(0, 0, 0, 0.55)',
                  color: '#fff',
                  border: 'none',
                  fontSize: '22px',
                  padding: '8px 14px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  zIndex: 2
                }}
              >
                &#10095;
              </button>
            )}
          </div>

          {/* Right: Product Details  */}
          <div style={{ flex: '1', minWidth: '320px', maxWidth: '540px' }}>
            <h2 style={{ fontSize: '28px', color: '#222', marginBottom: '12px', lineHeight: '1.3' }}>
              {product.name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#f58220' }}>
                {isDiscounted ? product.discountedPrice : product.price}₹/-
              </span>
              {isDiscounted && (
                <>
                  <span style={{ fontSize: '18px', textDecoration: 'line-through', color: '#888' }}>
                    {product.price}₹
                  </span>
                  <DiscountBadge percent={product.discountPercent} />
                </>
              )}
              <span style={{ fontSize: '12px', color: '#666' }}>(includes all taxes)</span>
            </div>

            <div style={{ marginBottom: '20px', backgroundColor: '#fafafa', padding: '16px', borderRadius: '10px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Description
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                {product.description || 'High quality essential provided directly by verified campus store.'}
              </p>
            </div>

            <div style={{ marginBottom: '20px', fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <strong>Shop name:</strong> <span style={{ color: '#f58220' }}>{product.shopName || 'Campus Store'}</span>
              </div>
              <div>
                <strong>Location:</strong> {product.shopLocation || 'LPU Campus Central'}
              </div>
              <div style={{ marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowCompare(true)}
                  style={{
                    backgroundColor: '#f0f4ff',
                    border: '1px solid #c7d8ff',
                    color: '#1a56db',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  Compare prices at other hostel shops
                </button>
              </div>
              {product.quantity > 0 && (
                <div>
                  <strong>Live Stock Remaining:</strong> {product.quantity} units
                </div>
              )}
            </div>

            {/* Action Buttons  Description-page */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '25px', marginBottom: '25px' }}>
              <button
                disabled={!product.inStock}
                onClick={() => addToCart(product, 1)}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: product.inStock ? '#0db60d' : '#888',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  boxShadow: product.inStock ? '0 4px 10px rgba(13, 182, 13, 0.3)' : 'none'
                }}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              <button
                disabled={!product.inStock}
                onClick={handleCheckoutNow}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: '#f58220',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                  boxShadow: '0 4px 10px rgba(245, 130, 32, 0.3)'
                }}
              >
                Proceed to Checkout
              </button>
            </div>

            {/* Horizontal thumbnail slider  */}
            {images.length > 1 && (
              <div style={{ marginTop: '20px' }}>
                <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>Product Angles:</span>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  overflowX: 'auto',
                  paddingTop: '8px',
                  paddingBottom: '8px'
                }}>
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setActiveImageIndex(idx)}
                      style={{
                        width: '75px',
                        height: '75px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: activeImageIndex === idx ? '2px solid #f58220' : '1px solid #ddd',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* More from this Shop */}
        {moreFromShop.length > 0 && (
          <section style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: '#222' }}>
              More from {product.shopName || 'this Shop'}
            </h3>
            <div style={{
              display: 'flex',
              gap: '15px',
              overflowX: 'auto',
              paddingBottom: '15px'
            }}>
              {moreFromShop.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{
                    minWidth: '200px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'}
                    alt={item.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                  />
                  <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ color: '#f58220', fontWeight: 'bold', fontSize: '14px' }}>
                    {item.discountedPrice || item.price}₹/-
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Based on your search / Related */}
        {relatedProducts.length > 0 && (
          <section style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '30px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', color: '#222' }}>
              Campus Suggestions & Similar Items
            </h3>
            <div style={{
              display: 'flex',
              gap: '15px',
              overflowX: 'auto',
              paddingBottom: '15px'
            }}>
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  onClick={() => navigate(`/product/${item._id}`)}
                  style={{
                    minWidth: '200px',
                    backgroundColor: '#fff',
                    borderRadius: '10px',
                    padding: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    cursor: 'pointer',
                    border: '1px solid #f0f0f0'
                  }}
                >
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop'}
                    alt={item.name}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }}
                  />
                  <div style={{ fontWeight: '600', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.name}
                  </div>
                  <div style={{ color: '#f58220', fontWeight: 'bold', fontSize: '14px' }}>
                    {item.discountedPrice || item.price}₹/-
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {/* Price Comparison Modal */}
      <PriceComparisonModal
        product={product}
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
      />
      </main>
    </div>
  );
};
