package com.dama.backend.dama.service;

import java.security.Key;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service

public class JwtService {
     private static final String SECRET_KEY= "D5EA55EA74AB3D1D84B25BB8313BD";
    public String extractUsername(String token)
    {
        return extractClaim(token, Claims::getSubject);
    }
    public <T> T extractClaim(String token, Function<Claims,T> claimsResolver)
    {
        final Claims  claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }
    public String generateToken(Map <String, Object> extraClaims,UserDetails userDetails)
    {
        return Jwts.builder()
        .setClaims(extraClaims).setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis()+1000*60))
        .signWith(getSignInKey(),SignatureAlgorithm.HS256).compact();
    }
    public boolean isTokenValid(String token,UserDetails userDetails)
    {
        final String username= extractUsername(token);
        return (username.equals(userDetails.getUsername())&& !isTokenExpired(token));
        
    }
    private boolean isTokenExpired(String token)
    {
        return extractExpiration(token).before(new Date());
    }
    private Date extractExpiration(String token)
    {
        return extractClaim(token, Claims::getExpiration);
    }
    private Claims extractAllClaims(String token)
    {
        return Jwts.parserBuilder().setSigningKey(getSignInKey()).build().parseClaimsJws(token).getBody();
    }
    private Key getSignInKey()
    {
        byte[] keybytes= Decoders.BASE64.decode(SECRET_KEY);
         return Keys.hmacShaKeyFor(keybytes);
    }

}
