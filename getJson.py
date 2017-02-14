#!/usr/bin/python

import os,sys
import json

def getDirsInDir(d, substr):
    return [d for d in os.listdir(d) if os.path.isdir(d) and d.find(substr)!=-1]

def walkThrough(path, filelist, withPrefix=True):
    if filelist==None:
        filelist = []
    files = os.listdir(path)
    for f in files:
        if os.path.isdir(path + f):
            filelist = walkThrough(path + f + '/', filelist)
        else:
            filelist.append(path + f if withPrefix else f);
    return filelist

def getFilesFullPathInDir(d):
    if d[-1]!='/': d = d + '/'
    filelist = []
    filelist = walkThrough(d, filelist)
    return filelist


def main():
    dirs = getDirsInDir(".", "tutorial")
    result = {}
    for d in dirs:
        result[d] = getFilesFullPathInDir(d)
    json_str = json.dumps(result)
    if len(sys.argv)<2:
        print 'USAGE: ', sys.argv[0], ' output.json'
        return
    outfile = sys.argv[1]
    if os.path.exists(outfile):
        answer = raw_input("File " + outfile + " exists!!! Do you want to replace it ([Y]es/[N]o): ")
        answer = answer.strip().lower()
        if answer=="n" or answer=="no":
            return
        else:
            print "Replacing file ", outfile
            f = open(outfile,'w')
            f.write(json_str)
    else:
        print "Writing to file ", outfile
        f = open(outfile, 'w')
        f.write(json_str)

if __name__ == '__main__':
    main()

