This command scans the local file system starting at the current directory and
reports on the instances of Ext JS and their license.

For example:

    sencha audit

This searches for folders containing "ext-all.js" and the license shipped with
the product. Versions prior to 4.0.2 did not contain the license text in this
file but did ship with a separate "license.txt" file. If these files have not
been preserved then this report may be incomplete.
