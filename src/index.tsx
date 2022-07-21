import * as ReactDOMClient from 'react-dom/client';
import './styles/index.css';
import App from './components/App';


// 1
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject
} from '@apollo/client';


// 3
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:4000'
});


// 4
const doc = document.getElementById('root')!;
const root = ReactDOMClient.createRoot(doc);
root.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);