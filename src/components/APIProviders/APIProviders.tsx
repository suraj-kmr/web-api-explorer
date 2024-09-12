  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { Link } from 'react-router-dom';
  import './APIProviders.css'

  const APIProviders: React.FC<{ sidebarOpen: boolean }> = ({ sidebarOpen }) => {
    const [providers, setProviders] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expandedProviders, setExpandedProviders] = useState<string[]>([]);
    const [providerApis, setProviderApis] = useState<{ [key: string]: any }>({});
    const [providerLoading, setProviderLoading] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
      axios.get('https://api.apis.guru/v2/providers.json')
        .then(response => {
          setProviders(response.data?.data);
          setLoading(false);
        })
        .catch((error) => {
        });
    }, []);

    const handleExpand = (provider: string) => {
      const updatedExpandedProviders = expandedProviders.includes(provider)
        ? expandedProviders.filter(p => p !== provider)
        : [...expandedProviders, provider];
      setExpandedProviders(updatedExpandedProviders);
    };

    const fetchApisForProvider = async (provider: string) => {
      setProviderLoading({ ...providerLoading, [provider]: true });
      try {
        const response = await axios.get(`https://api.apis.guru/v2/${provider}.json`);
        setProviderApis({ ...providerApis, [provider]: response?.data?.apis });
        setProviderLoading({ ...providerLoading, [provider]: false });
      } catch (error) {
        setProviderLoading({ ...providerLoading, [provider]: false });
      }
    };

    if (loading) return <p>Loading Providers...</p>;

    return (
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <h2 className="provider-title">Select Provider</h2>
        <div>
          {providers.map(provider => (
            <div key={provider}>
              <div className="provider-item" onClick={() => {
                handleExpand(provider);
                fetchApisForProvider(provider);
              }}>
                <div>
                  {provider}
                </div>
                <span className="arrow-icon" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-down" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </span>
              </div>
              {providerApis[provider] && (
                <ul>
                {providerLoading[provider] ? (
                  <li>Loading...</li>
                ) : (
                  Object.keys(providerApis[provider]).map(providerKey => {
                    const providerInfo = providerApis[provider][providerKey];
                    const info = providerInfo.info;
                    return (
                      <li key={info} className="sidebar-item">
                        <Link to={`/provider/${provider}?key=${providerKey}`}>
                        {
                          info['x-logo']?.url && (
                            <img className="sidebar-image" src={info['x-logo']?.url} alt={provider} />
                          )
                        }
                          {info.title}
                        </Link>
                      </li>
                    );
                  })
                )}
              </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  export default APIProviders;