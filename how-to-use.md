Soft launch of a secret project I have been working on!

This is a webapp we'll be using to create a (sprawling?!) map of wizard city! I need you to try it out and tell me all the ways it is broken before I get more public about it:

https://wizardcity.fun

Basic gist: we're building an interconnected set of maps. I want to print it out at the con so we can marvel at it together.

In Wizard City there are a lot of maps. Each map has cells that have lots of information about what's going on in the map as well as how they link to other cells in other maps.

Each map has:

- A size (smallest size is 10x10, largest is 100x100) that defines how many cells it has
- A name

Each Cell can have:

- A description
- A link to another cell in any other map
- A "Structure" which is a poorly drawn pixel art png (I need a lot more of these!). Edit these in Structure mode by clicking on the image you want to place and then clicking on the cell

You can define Regions of Cells. To edit a Region go into the Region mode and select all the cells in that region. Then define the following:

- A name
- A color
- A description

You can make Magic Items on the "Magic Items" page. Each magic item can have:

- A name
- A cell they belong to
- Facts about it
- A rarity

You can make NPWs (Non-player Wizards) on the "Non-player Wizard" page. Each NPW can have:

- A name
- a cell they are in
- A Class
- Current HP
- Facts about them

To make a new map go to here: https://wizardcity.fun/

You will need to use discord to log in if you want to see anything beyond the homepage.

If you run into issues a refresh will usually get you unstuck. If you can take time to make an issue in github that will help me immensely! If you can submit a PR that will help even more!

https://github.com/csalzman/wizardcity
