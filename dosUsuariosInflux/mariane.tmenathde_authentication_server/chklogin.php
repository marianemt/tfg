<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

//instead of database here to have it simple, just a json list of logins
$jsonuserlist = '{
	"logins": [{
			"user": "user1",
			"role": "dashbordviewer",
			"displayname": "Joseba Extebarria",
			"company": "SF Technologies",
			"password": "!Mmt1234",
			"email": "joseba.extebarria@tmenath.de",
			"bucketid": "temperatures"
		},
		{
			"user": "user2",
			"role": "dashbordviewer",
			"displayname": "Nerea Mendiguren",
			"company": "Mendi Construcciones",
			"password": "!Mmt4321",
			"email": "nerea.mendiguren@tmenath.de",
			"bucketid": "movimientos"
		}
	]
}';
$userarray =  json_decode($jsonuserlist, true);

/* Receive the RAW post data. */

$content = trim(file_get_contents("php://input"));
// for testing standalone: //$content = '{"username": "user2","password": "!Mmt4321"}';

/* $decoded can be used the same as you would use $_POST in $.ajax */
$data = json_decode($content, true);

/* Send error to Fetch API, if JSON is broken */
if (!is_array($data))
    die(json_encode([
        'value' => 0,
        'error' => 'Received JSON is improperly formatted',
        'data' => $content,
    ]));
/*else
    echo json_encode($data);
*/

$username = $data['username'];
$password = $data['password'];


if ((isset($username) && isset($password)) and ($username && $password)) {

    // here could go check against database etc. in the simple case only a little json decoded to array
    $userfiltered = array_filter($userarray['logins'], function ($logins) use ($username) {
        return $logins['user'] == $username;
    });

    if (count($userfiltered) == 0) {
        $user = array();
        $user['valid'] = false;
        $user['error'] = true;
        $user['message'] = 'Invalid login, username unknown';
        $response = 400;
    } else {
        $user = array_values($userfiltered)[0]; //first hit - array_values needed fro reindex array to 0
        if ((isset($user['password'])) && ($password == $user['password'])) { // here could go check against database etc.
            $user['password'] = "******"; //remove password from result json
            $response = 200;
        } else {
            $user = array();
            $user['valid'] = false;
            $user['error'] = true;
            $user['message'] = 'Invalid login';
            $response = 400;
        }
    }
} else {
    $response = 500;
    $user = array();
    $user['valid'] = false;
    $user['error'] = true;
    $user['message'] = 'No data received';
}
http_response_code($response);
echo json_encode($user);

exit();
