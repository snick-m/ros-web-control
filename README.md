# A ROS to Web Love Story
A Proof of Concept that demos direct ROS to Web Frontend communication for a control panel on the web.

It uses the following ROS nodes for its functionality :-
 1. [rosbridge-server](https://wiki.ros.org/rosbridge_suite)
 2. [usb-cam](https://wiki.ros.org/usb_cam)
 3. [web-video-server](https://wiki.ros.org/web_video_server)

> P.S: It is currently configured to control the Turtle in `turtlesim`.
> 
>`rosrun turtlesim turtlesim_node`

ROS Bridge Server
--
At the center of communication lies the ROS Bridge which allows applications to communicate with the PubSub layer of ROS directly. `roslibjs` is used on the frontend to allow connection to `rosbridge-server`

To Launch: `roslaunch rosbridge_server rosbridge_websocket.launch`

USB Cam
--
USB Cam will allow ROS to take images from a camera connected via USB and send the images to `/usb_camera/image_raw` topic.

To Launch: `rosrun usb_cam usb_cam_node`

Web Video Server
--
Finally, `web-video-server` consumes the images from various available `sensors/Image` topics and hosts a webserver to create direct video stream URLs that can be displayed on any webpage. URLs for the stream follow the format, `http://localhost:8080/stream?topic=/usb_cam/image_raw`

To Launch: `rosrun web_video_server web_video_server`