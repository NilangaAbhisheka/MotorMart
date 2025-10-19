export default function AboutUs() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Car Image */}
          <div className="relative">
            <img 
              src="/src/assets/1.jpg" 
              alt="Mercedes-Benz AMG" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <span className="text-orange-500 font-semibold text-sm uppercase tracking-wide">
                About Us
              </span>
              <h2 className="text-4xl font-bold text-gray-800 leading-tight">
                Revving The Future: Your Ultimate Auction Car Destination
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                At MotorMart, we redefine the car-buying experience by merging cutting-edge technology with the excitement of live auctions. Our user-friendly interface allows you to browse an extensive inventory of carefully curated vehicles, from sleek sedans to powerful trucks and everything in between.
              </p>
            </div>
            
            {/* Features List */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600">
                  <span className="font-semibold">Diverse Inventory:</span> Explore a wide range of vehicles, each meticulously inspected and verified.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600">
                  <span className="font-semibold">Live Auctions:</span> Immerse yourself in the excitement of real-time bidding.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600">
                  <span className="font-semibold">Transparency:</span> We believe in openness and provide detailed information about every vehicle.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600">
                  <span className="font-semibold">User-Friendly Platform:</span> Navigate effortlessly through our intuitive website.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-600">
                  <span className="font-semibold">Secure Transactions:</span> Bid with confidence, knowing that your transactions are secure.
                </p>
              </div>
            </div>
            
            {/* Signature */}
            <div className="pt-4">
              <div className="text-gray-400 text-right font-handwriting text-xl">
                MotorMart Team
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

