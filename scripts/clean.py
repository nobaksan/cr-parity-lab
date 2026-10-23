import os
import sys

def clean(path):
    for name in os.listdir(path):
        print(name)

if __name__ == "__main__":
    clean(sys.argv[1])
