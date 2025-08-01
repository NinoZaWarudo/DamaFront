package com.dama.backend.dama.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.dama.backend.dama.service.JwtService;

import io.micrometer.common.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,@NonNull FilterChain filterChain) throws ServletException, IOException {
      final String authHeader = request.getHeader("Authorization");
      
      if(authHeader==null || !authHeader.startsWith("Bearer "))
     {
        filterChain.doFilter(request, response);
        return;

     } 
     final String jwt = authHeader.substring(7);
     final String username=jwtService.extractUsername(jwt);
     if (username != null && SecurityContextHolder.getContext().getAuthentication()==null)
     {
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
        if(jwtService.isTokenValid(jwt, userDetails))
        {
            UsernamePasswordAuthenticationToken authenticationToken= new UsernamePasswordAuthenticationToken
            (userDetails, null,userDetails.getAuthorities());
            authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }
     }
     filterChain.doFilter(request, response);
    }
    
}
