## /codes/Backend/lib/ct-app-config
1. Extracts configurations from config file passed as enviroment variable, works on any level nested json file.
2. Usage :-
    import { AppConfig } from 'ct-app-config';

    const appConfig = new AppConfig();

    let someModule = appConfig.getConfig("apis:someModule:get");

3. I really liked the way of parsing json.

## /codes/Backend/A microservices..../bts-master
1. BTS(But Tracking System) is a small micro-service in our ecosystem.
2. It allows users in our dashboard to file bugs and keep checking for the status. It is basic module written in just 2 days, have plans to improvise.

## /codes/frontend/lib/ct-drag-js
1. We've requirements of having editor tools in our dashboard for a concept called Sermon App. Editor tools for the frontend is a complex UI and Interactions example dragging, resizing etcs. So, everytime, it was taking some good time to go through similar logics and increased the chances of bugs. So, I wrote a common lib, using which, Frontend devs can do these things in a very simple way. Example : One can make any html element draggable by just, passing it to a functions, same way for resizable. Also, You can have different tools that can be arranged and designed in any way and each one of them has actions like Bold, Italic, Underline, Bullet and Numbering, Positioning etcs.

2. For usage, Readme.md is also attached in the zip.

## /pocs/frontend/presentation-maker-master
1. This project was the first P.O.C, before ct-drag-js. This is basically a powerpoint editor for web. You can create slides, design it and finally generate a PPT. It is just the frontend and written on React JS.

## /pocs/backend/grid-server-django-master
1. We have a concept called Outreach, where we needed to track the movement of user in a certain state, and find out his off route or halt data.

2. Grid-server is a python-django, shapely based project, that basically has functions to create Fishnet over a bound, that we've used to create 1 sq km grids over entire US.

3. We calculate Users movement now based on which grid he's in and, till how much time, we got ping from the same grid, and if he is in any of our grids or not.