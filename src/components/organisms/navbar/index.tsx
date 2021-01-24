import React from 'react';
import { useSelector } from 'react-redux';
import { Channel } from '~/state/ducks/channel/channelSlice';
import { RootState } from '~/state/store';

type NavbarProps = {
  showDrawer: boolean;
  toggleDrawer: () => void;
  channels: Record<string, Channel>;
  moveToNewChannel: () => void;
  moveToChannel: (cid: string) => void;
};

const Navbar: React.FC<NavbarProps> = ({
  showDrawer,
  toggleDrawer,
  channels,
  moveToNewChannel,
  moveToChannel,
}) => {
  const router = useSelector((state: RootState) => state.router);
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="text-lg font-medium text-grey-700">
                Liber v0.0.1
              </div>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={(e) => toggleDrawer()}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-grey-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>

              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showDrawer ? (
        <>
          <div
            className={
              'md:hidden border-t border-gray-400 absolute z-50 shadow-lg bg-white w-full'
            }
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button
                onClick={(e) => moveToNewChannel()}
                className="inline-flex items-center justify-center my-2 w-full border-2 border-red-500 flex-shrink-0 text-red-500 text-base font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-50 hover:border-red-300 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-red-200"
              >
                <svg
                  className="h-6 w-6 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Open New Channel
              </button>
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-white">
                Channels
              </div>
              {Object.values(channels).map((channel) => {
                let className =
                  'block ml-3 px-3 py-2 rounded-md text-base font-semibold ';
                if (router.location.pathname.includes(channel.id)) {
                  className += 'bg-gray-500 text-white';
                } else {
                  className +=
                    'text-gray-400 hover:text-white hover:bg-gray-700';
                }
                return (
                  <button
                    onClick={() => {
                      moveToChannel(channel.id);
                    }}
                    key={channel.id}
                    className={className}
                  >
                    {channel.name || channel.id}
                  </button>
                );
              })}
            </div>
            <div className="pb-3 border-t border-gray-400">
              <div className="mt-3 px-2 space-y-1">
                <a
                  href="/#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-300"
                >
                  Join Channel Manually
                </a>
                <a
                  href="/#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-300"
                >
                  Setting
                </a>
                <a
                  href="/#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-500 hover:bg-gray-300"
                >
                  About Us
                </a>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </nav>
  );
};

export default Navbar;
