import { Link } from "react-router-dom";
import { FaDiscord, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-blue-500 font-bold text-xl mb-4">MORENT</h2>
            <p className="text-gray-600 text-sm">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-blue-500 text-sm">How it works</Link></li>
              <li><Link to="/featured" className="text-gray-600 hover:text-blue-500 text-sm">Featured</Link></li>
              <li><Link to="/partnership" className="text-gray-600 hover:text-blue-500 text-sm">Partnership</Link></li>
              <li><Link to="/business-relation" className="text-gray-600 hover:text-blue-500 text-sm">Business Relation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Community</h3>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-gray-600 hover:text-blue-500 text-sm">Events</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-blue-500 text-sm">Blog</Link></li>
              <li><Link to="/podcast" className="text-gray-600 hover:text-blue-500 text-sm">Podcast</Link></li>
              <li><Link to="/invite" className="text-gray-600 hover:text-blue-500 text-sm">Invite a friend</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Socials</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://discord.gg/morent" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 text-sm flex items-center">
                  <FaDiscord className="mr-2" /> Discord
                </a>
              </li>
              <li>
                <a href="https://instagram.com/morent" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 text-sm flex items-center">
                  <FaInstagram className="mr-2" /> Instagram
                </a>
              </li>
              <li>
                <a href="https://twitter.com/morent" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 text-sm flex items-center">
                  <FaTwitter className="mr-2" /> Twitter
                </a>
              </li>
              <li>
                <a href="https://facebook.com/morent" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-500 text-sm flex items-center">
                  <FaFacebook className="mr-2" /> Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mt-10 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <p>©2025 MORENT. All rights reserved</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-blue-500">Privacy & Policy</Link>
            <Link to="/terms" className="hover:text-blue-500">Terms & Condition</Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 