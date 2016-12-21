import axios from 'axios';

axios.get('/proxy/alfresco/api/people');
axios.post('/proxy/alfresco/slingshot/profile/userstatus', { status: 'test'});