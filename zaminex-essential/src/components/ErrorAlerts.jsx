import { useEffect } from 'react';
import { useCRM } from '../store/useCRM';
import { showError } from '../services/alerts';
export default function ErrorAlerts() {
 const error=useCRM(state=>state.error);
 useEffect(()=>{
  if(!error)return;
  useCRM.setState({error:''});
  void showError(error);
 },[error]);
 return null;
}
