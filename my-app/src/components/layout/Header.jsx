import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag, Camera, TvMinimal, ShoppingCart, Trophy, Menu, X, LogOut, User, Home, Shield, GraduationCap, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap');

.tcgh {
  --pink: #FFA8E0; --pink-soft: #FFD3F0; --plum: #2A0A3F; --plum-2: #4A1470; --lime: #C6FF3D;
  font-family: 'DM Sans', system-ui, sans-serif;
  position: sticky; top: 0; z-index: 50;
  background: linear-gradient(90deg, var(--pink), var(--pink-soft), var(--pink));
  background-size: 200% 100%;
  animation: tcgh-bg 12s ease-in-out infinite;
  border-bottom: 3px solid var(--plum);
  transition: box-shadow .3s, padding .3s;
}
.tcgh.scrolled { box-shadow: 0 6px 0 rgba(42,10,63,.9); }
.tcgh * { box-sizing: border-box; }
@keyframes tcgh-bg { 0%,100% { background-position: 0% 50% } 50% { background-position: 100% 50% } }
@keyframes tcgh-drop { from { opacity: 0; transform: translateY(-14px) } to { opacity: 1; transform: none } }
@keyframes tcgh-in { from { opacity: 0; transform: translateX(-18px) } to { opacity: 1; transform: none } }
@keyframes tcgh-ping { 0% { box-shadow: 0 0 0 0 rgba(198,255,61,.9) } 100% { box-shadow: 0 0 0 10px rgba(198,255,61,0) } }
@keyframes tcgh-pop { 0% { transform: scale(.3) } 60% { transform: scale(1.35) } 100% { transform: scale(1) } }
@keyframes tcgh-wiggle { 0%,100% { transform: rotate(0) } 25% { transform: rotate(-14deg) } 75% { transform: rotate(14deg) } }

.tcgh-bar { max-width: 1200px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; transition: padding .3s; }
.tcgh.scrolled .tcgh-bar { padding-block: 8px; }

/* logo */
.tcgh-logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--plum); }
.tcgh-logo-img { position: relative; width: 44px; height: 44px; border-radius: 14px; background: #fff; border: 3px solid var(--plum); overflow: hidden; box-shadow: 3px 3px 0 var(--plum); transition: transform .35s cubic-bezier(.3,1.6,.5,1), box-shadow .3s; }
.tcgh-logo:hover .tcgh-logo-img { transform: rotate(-8deg) scale(1.08); box-shadow: 5px 5px 0 var(--plum); }
.tcgh-logo-img img { width: 100%; height: 100%; object-fit: contain; display: block; }
.tcgh-dot { position: absolute; top: -4px; right: -4px; width: 14px; height: 14px; border-radius: 50%; background: var(--lime); border: 2px solid var(--plum); animation: tcgh-ping 1.6s infinite; z-index: 2; }
.tcgh-logo-wrap { position: relative; }
.tcgh-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -.02em; line-height: 1.05; transition: color .25s; }
.tcgh-logo:hover .tcgh-name { color: var(--plum-2); }
@media (max-width: 400px) { .tcgh-name { font-size: 16px; } }

/* desktop nav */
.tcgh-nav { display: none; align-items: center; gap: 6px; }
@media (min-width: 1024px) { .tcgh-nav { display: flex; } .tcgh-burger { display: none !important; } .tcgh-mobile { display: none !important; } }

.tcgh-link { position: relative; display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 14px; font-size: 14px; font-weight: 700; color: var(--plum); text-decoration: none; transition: background .25s, color .25s, transform .25s; }
.tcgh-link svg { transition: transform .3s; }
.tcgh-link:hover { background: rgba(255,255,255,.75); transform: translateY(-2px); }
.tcgh-link:hover svg { animation: tcgh-wiggle .5s; }
.tcgh-link.active { background: var(--plum); color: var(--lime); }
.tcgh-link.active::after { content: ''; position: absolute; bottom: 4px; left: 50%; width: 6px; height: 6px; border-radius: 50%; background: var(--lime); transform: translateX(-50%) translateY(10px); opacity: 0; }

.tcgh-cart { position: relative; display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: #fff; border: 2px solid var(--plum); color: var(--plum); text-decoration: none; margin: 0 6px; transition: transform .25s, box-shadow .25s, background .25s; }
.tcgh-cart:hover { transform: translateY(-3px) rotate(-4deg); box-shadow: 4px 4px 0 var(--plum); background: var(--lime); }
.tcgh-badge { position: absolute; top: -9px; right: -9px; min-width: 22px; height: 22px; padding: 0 5px; border-radius: 999px; background: var(--plum); color: var(--lime); border: 2px solid #fff; font-size: 11px; font-weight: 800; display: grid; place-items: center; animation: tcgh-pop .5s cubic-bezier(.3,1.6,.5,1); }

.tcgh-btn { position: relative; overflow: hidden; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 18px; border-radius: 14px; font-size: 14px; font-weight: 700; font-family: inherit; border: 2px solid var(--plum); text-decoration: none; cursor: pointer; transition: transform .25s, box-shadow .25s, background .25s; }
.tcgh-btn::before { content: ''; position: absolute; top: 0; left: -120%; width: 60%; height: 100%; background: linear-gradient(120deg, transparent, rgba(255,255,255,.6), transparent); transform: skewX(-20deg); transition: left .6s; }
.tcgh-btn:hover::before { left: 140%; }
.tcgh-btn:hover { transform: translateY(-3px); box-shadow: 4px 4px 0 var(--plum); }
.tcgh-btn:active { transform: translateY(0); box-shadow: none; }
.tcgh-btn.outline { background: #fff; color: var(--plum); }
.tcgh-btn.outline:hover { background: var(--pink-soft); }
.tcgh-btn.solid { background: var(--plum); color: var(--lime); }
.tcgh-btn.solid:hover { background: var(--plum-2); }
.tcgh-btn.danger:hover { background: #ffe1e6; }
.tcgh-cta { display: flex; align-items: center; gap: 10px; margin-left: 8px; }

/* user chip + dropdown */
.tcgh-user { display: flex; align-items: center; gap: 10px; padding: 6px 14px 6px 6px; background: #fff; border: 2px solid var(--plum); border-radius: 16px; }
.tcgh-avatar { width: 36px; height: 36px; border-radius: 12px; background: var(--plum); color: var(--lime); display: grid; place-items: center; }
.tcgh-uname { font-weight: 800; font-size: 14px; line-height: 1.1; display: block; color: var(--plum); }
.tcgh-urole { font-size: 11px; color: rgba(42,10,63,.65); font-weight: 600; }
.tcgh-menu { position: absolute; right: 0; top: calc(100% + 10px); width: 210px; background: #fff; border: 3px solid var(--plum); border-radius: 18px; box-shadow: 6px 6px 0 var(--plum); padding: 8px; z-index: 60; animation: tcgh-drop .25s both; }
.tcgh-menu small { display: block; padding: 6px 10px 8px; font-size: 11px; font-weight: 700; color: rgba(42,10,63,.55); border-bottom: 2px dashed rgba(42,10,63,.2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .06em; }
.tcgh-out { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px; border-radius: 12px; border: none; background: transparent; color: #c0123b; font-weight: 700; font-size: 14px; cursor: pointer; font-family: inherit; transition: background .2s, transform .2s; }
.tcgh-out:hover { background: #ffe1e6; transform: translateX(4px); }
.tcgh-chev { transition: transform .25s; }
.tcgh-chev.open { transform: rotate(180deg); }

/* burger */
.tcgh-burger { display: grid; place-items: center; width: 46px; height: 46px; border-radius: 14px; background: var(--plum); color: var(--lime); border: none; cursor: pointer; transition: transform .25s, background .25s; }
.tcgh-burger:hover { transform: rotate(-6deg) scale(1.06); background: var(--plum-2); }
.tcgh-burger svg { animation: tcgh-pop .35s; }

/* mobile menu */
.tcgh-mobile { max-width: 1200px; margin: 0 auto; padding: 0 16px 18px; animation: tcgh-drop .3s both; }
.tcgh-mobile-in { display: flex; flex-direction: column; gap: 8px; padding: 14px; background: rgba(255,255,255,.7); border: 3px solid var(--plum); border-radius: 22px; box-shadow: 6px 6px 0 var(--plum); backdrop-filter: blur(8px); }
.tcgh-mlink { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 16px; border-radius: 14px; font-weight: 700; color: var(--plum); text-decoration: none; background: #fff; border: 2px solid transparent; animation: tcgh-in .4s both; animation-delay: var(--i, 0ms); transition: transform .2s, border-color .2s, background .2s; }
.tcgh-mlink span.l { display: flex; align-items: center; gap: 12px; }
.tcgh-mlink:hover { transform: translateX(6px); border-color: var(--plum); }
.tcgh-mlink.active { background: var(--plum); color: var(--lime); }
.tcgh-mbtns { display: grid; gap: 10px; margin-top: 6px; animation: tcgh-in .4s both; animation-delay: var(--i, 0ms); }
.tcgh-mbtns .tcgh-btn { width: 100%; padding: 13px; }

@media (prefers-reduced-motion: reduce) { .tcgh, .tcgh * { animation: none !important; transition: none !important; } }
`

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const { cartItems } = useCart()

  const isHomePage = location.pathname === '/'

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // close menus when the route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }, [location.pathname])

  const navItems = [
    { to: '/', label: 'Home', Icon: Home, active: isHomePage },
    { to: '/shop', label: 'Shop', Icon: ShoppingBag, active: location.pathname === '/shop' },
    { to: '/media', label: 'Media', Icon: Camera, active: location.pathname === '/media' },
    { to: '/matches', label: 'Matches', Icon: TvMinimal, active: location.pathname === '/matches' },
  ]

  return (
    <header className={`tcgh ${scrolled ? 'scrolled' : ''}`}>
      <style>{styles}</style>
      <div className="tcgh-bar">
        <Link to="/" className="tcgh-logo">
          <div className="tcgh-logo-wrap">
            <div className="tcgh-logo-img">
              <img src="/TikoneCricketGurukul1.png" alt="Logo" />
            </div>
            <span className="tcgh-dot"></span>
          </div>
          <span className="tcgh-name">Tikone Cricket Gurukul</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="tcgh-nav">
          {!isAuthenticated ? (
            <>
              {navItems.map(({ to, label, Icon, active }) => (
                <Link key={to} to={to} className={`tcgh-link ${active ? 'active' : ''}`}>
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}

              <Link to="/cart" className="tcgh-cart" aria-label="Cart">
                <ShoppingCart size={22} />
                {cartItems.length > 0 && (
                  <span key={cartItems.length} className="tcgh-badge">{cartItems.length}</span>
                )}
              </Link>

              <div className="tcgh-cta">
                <Link to="/admin/login" className="tcgh-btn outline">
                  <Shield size={16} />
                  <span>Admin Portal</span>
                </Link>
                <Link to="/student/login" className="tcgh-btn solid">
                  <GraduationCap size={16} />
                  <span>Student Portal</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="tcgh-cta">
              <div className="tcgh-user">
                <div className="tcgh-avatar"><User size={18} /></div>
                <div>
                  <span className="tcgh-uname">{user?.name || 'User'}</span>
                  <span className="tcgh-urole">{isAdmin ? 'Administrator' : 'Student'}</span>
                </div>
              </div>

              <div style={{ position: 'relative' }}>
                <button type="button" className="tcgh-btn outline danger" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  <LogOut size={16} />
                  <span>Logout</span>
                  <ChevronDown size={14} className={`tcgh-chev ${isDropdownOpen ? 'open' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="tcgh-menu">
                    <small>Account Actions</small>
                    <button type="button" onClick={handleLogout} className="tcgh-out">
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="tcgh-burger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X key="x" size={24} /> : <Menu key="m" size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="tcgh-mobile">
          <div className="tcgh-mobile-in">
            {!isAuthenticated ? (
              <>
                {navItems.map(({ to, label, Icon, active }, i) => (
                  <Link
                    key={to}
                    to={to}
                    className={`tcgh-mlink ${active ? 'active' : ''}`}
                    style={{ '--i': `${i * 60}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="l"><Icon size={20} /><span>{label}</span></span>
                  </Link>
                ))}

                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="tcgh-mlink"
                  style={{ '--i': '240ms' }}
                >
                  <span className="l"><ShoppingCart size={20} /><span>Cart</span></span>
                  {cartItems.length > 0 && <span className="tcgh-badge" style={{ position: 'static' }}>{cartItems.length}</span>}
                </Link>

                <div className="tcgh-mbtns" style={{ '--i': '300ms' }}>
                  <Link to="/admin/login" onClick={() => setIsMenuOpen(false)} className="tcgh-btn outline">
                    <Shield size={16} />
                    <span>Admin Portal</span>
                  </Link>
                  <Link to="/student/login" onClick={() => setIsMenuOpen(false)} className="tcgh-btn solid">
                    <GraduationCap size={16} />
                    <span>Student Portal</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="tcgh-user" style={{ animation: 'tcgh-in .4s both' }}>
                  <div className="tcgh-avatar"><User size={18} /></div>
                  <div>
                    <span className="tcgh-uname">{user?.name || 'User'}</span>
                    <span className="tcgh-urole">{isAdmin ? 'Administrator' : 'Student'}</span>
                  </div>
                </div>
                <div className="tcgh-mbtns" style={{ '--i': '80ms' }}>
                  <button
                    type="button"
                    className="tcgh-btn outline danger"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
} 
