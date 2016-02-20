#!/bin/sh

if [ -e /etc/profile ]
then
    source /etc/profile;
fi

if [ -e ~/.bash_profile ]
then
    source ~/.bash_profile;
fi

if [ -e ~/.profile ]
then
    source ~/.profile;
fi

if [ -e ~/.bashrc ]
then
    source ~/.bashrc;
fi

# now run the passed command
$*