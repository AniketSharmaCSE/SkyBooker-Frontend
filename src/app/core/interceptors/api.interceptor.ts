import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  // Use the Render API Gateway in production, but use local proxy (empty string) in development
  const baseUrl = isDevMode() ? '' : 'https://apigateway-q88c.onrender.com';
  
  // If the request starts with a slash, it's an API call that needs the base URL
  if (req.url.startsWith('/') && !req.url.startsWith('http')) {
    const apiReq = req.clone({ url: `${baseUrl}${req.url}` });
    return next(apiReq);
  }
  
  return next(req);
};
