#!/usr/bin/python
import os, sys
import shutil, platform, subprocess

def fork(args, quiet=False):
    # We need to insert the python executable to be safe
    #args.insert(0, sys.executable)
    proc = subprocess.Popen(args, stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    while proc.poll() == None:
        line = proc.stdout.readline()
        if line and not quiet:
            print line.strip()
            sys.stdout.flush()
    return proc.returncode

def fork_ant(directory, cmd, quiet=False):
    proc = subprocess.Popen(cmd, shell=True, cwd=directory, stderr=subprocess.STDOUT, stdout=subprocess.PIPE)
    while proc.poll() == None:
        line = proc.stdout.readline()
        if line and not quiet:
            print line.strip()
            sys.stdout.flush()
    return proc.returncode

def create_build_module(platform):
    build_path = os.path.join(os.getcwd(), platform, 'build.py')
    retcode = fork([build_path], False)
    if retcode == 0:
        print "Created %s module project" % platform
    else:
        die("Aborting")

def create_ant_module(platform):
    ant_path = os.path.join(os.getcwd(), platform)
    retcode = fork_ant(ant_path, 'ant', False)
    if retcode == 0:
        print "Created %s module project" % platform
    else:
        die("Aborting")

def clean_build_module(platform):
    build_path = os.path.join(os.getcwd(), platform, 'build')
    shutil.rmtree(build_path)
    print "Cleaned %s module project" % platform

def clean_ant_module(platform):
    ant_path = os.path.join(os.getcwd(), platform)
    retcode = fork_ant(ant_path, 'ant clean', False)
    print "Cleaned %s module project" % platform

def main(args):
    print "Appcelerator Titanium Module Packager"
    print

    if len(args) < 2:
        cmd = 'build'
    elif args[1] == 'clean':
        cmd = 'clean'
    else:
        die("Invalid command")

    if cmd == 'build':
        if os.path.exists('iphone'):
            create_build_module('iphone')

        if os.path.exists('mobileweb'):
            create_build_module('mobileweb')

        if os.path.exists('android'):
            create_ant_module('android')

        if os.path.exists('commonjs'):
            create_build_module('commonjs')
    elif cmd == 'clean':
        if os.path.exists('iphone'):
            clean_build_module('iphone')

        if os.path.exists('mobileweb'):
            clean_build_module('mobileweb')

        if os.path.exists('android'):
            clean_ant_module('android')

        if os.path.exists('commonjs'):
            clean_build_module('commonjs')

if __name__ == "__main__":
    main(sys.argv)