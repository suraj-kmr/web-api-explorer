  import React, { useEffect, useState } from 'react';
  import { useLocation, useParams } from 'react-router-dom';
  import axios from 'axios';
  import './APIDetails.css';

  interface API {
    title: string;
    image: string;
    description: string;
    swagger: string;
    email: string;
    name: string;
    url: string;
  }

  const APIDetails: React.FC = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location?.search);
    const providerKey = searchParams.get('key');
    const { provider } = useParams<{ provider: string }>();
    const [apis, setApis] = useState<API[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    
    useEffect(() => {
      if (provider && providerKey) {
        axios.get(`https://api.apis.guru/v2/${provider}.json`)
          .then(response => {
            const apiData = response.data.apis[providerKey];
            
            if (apiData) {
              const filteredApi = {
                title: apiData?.info?.title,
                image: apiData?.info['x-logo']?.url,
                description: apiData?.info?.description,
                swagger: apiData?.swaggerUrl,
                email: apiData?.info?.contact?.email,
                name: apiData?.info?.contact?.name,
                url: apiData?.info?.contact?.url,
              };
              setApis([filteredApi]); 
            }
            else {
              setApis([]);
            }
            setLoading(false);
          });
      }
    }, [provider, providerKey]);

    if (loading) return <p>Loading APIs...</p>;

    return (
      <div className="container">
        {
          apis?.map((api)=>{
            return (
              <span key={api?.title}>
                <h1 className="title" key={api?.title}>
                  {api?.image && (
                    <img className="provider-image" src={api?.image} alt={provider}/>
                  )}                          
                  {api.title}
                </h1>
                <div className='description-section'>
                  <strong>Description</strong>
                  <p dangerouslySetInnerHTML={{ __html: api?.description }} />
                  <strong>Swagger</strong>
                  <p>{api?.swagger}</p>
                  <strong>Contact</strong>
                  <p>Email: {api?.email}</p>
                  <p>Name: {api?.name}</p>
                  <p>Url: {api?.url}</p>
                </div>
              </span>
            )
          })
        }
        
      </div>
    );
  };

  export default APIDetails;
