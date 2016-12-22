import axios from 'axios';

export default class NodeService {

   getItems(options) {
      return axios.get(`/proxy/alfresco/api/-default-/public/alfresco/versions/1/nodes/-root-/children?include=path&skipCount=${options.skipCount}&maxItems=${options.maxItems}&relativePath=${options.relativePath}`);
   }
}