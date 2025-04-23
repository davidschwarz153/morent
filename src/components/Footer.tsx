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
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">How it works</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Featured</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Partnership</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Business Relation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Events</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Podcast</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Invite a friend</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Socials</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Discord</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Instagram</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Twitter</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 text-sm">Facebook</a></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between mt-10 pt-6 border-t border-gray-200 text-sm text-gray-600">
          <p>©2023 MORENT. All rights reserved</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-blue-500">Privacy & Policy</a>
            <a href="#" className="hover:text-blue-500">Terms & Condition</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 