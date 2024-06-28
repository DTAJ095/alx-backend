#!/usr/bin/python3
""" Speed up your python program with cache decorators """
from functools import cache, lru_cache
import timeit


# without caching
def fibonacci_no_cache(n):
    if n <= 1:
        return n
    return fibonacci_no_cache(n-1) + fibonacci_no_cache(n-2)

# with cache
@cache
def fibonacci_with_cache(n):
    if n <= 1:
        return n
    return fibonacci_with_cache(n-1) + fibonacci_with_cache(n-2)

# with LRU cache (Least Recently Used)
@lru_cache
def fibonacci_lru_cache(n):
    if n <= 1:
        return n
    return fibonacci_lru_cache(n-1) + fibonacci_lru_cache(n-2)


if __name__ == '__main__':
    n = 35
    no_cache = fibonacci_no_cache(n)
    print(no_cache)
    with_cache = fibonacci_with_cache(n)
    print(with_cache)
    lru_cache = fibonacci_lru_cache(n)
    print(lru_cache)
    
    # let's compare the execution times of each function to get the most performant
    no_cache_time = timeit.timeit(lambda: fibonacci_no_cache(n), number=1)
    with_cache_time = timeit.timeit(lambda: fibonacci_with_cache(n), number=1)
    lru_cache_time = timeit.timeit(lambda: fibonacci_lru_cache(n), number=1)
    
    # let's print the result
    print(f"Time without cache: {no_cache_time:.5f} seconds")
    print(f"Time with cache: {with_cache_time:.5f} seconds")
    print(f"Time with LRU cache: {lru_cache_time:.5f} seconds")