<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {

	public function __construct($config = 'rest')
	{
		parent::__construct();
		
		header('Access-Control-Allow-Origin: http://movierating.epizy.com');
		header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
		header("Access-Control-Allow-Headers: *");
		if ( "OPTIONS" === $_SERVER['REQUEST_METHOD'] ) {
			die();
		}
		
	}

	public function login()
	{
		$method = $_SERVER['REQUEST_METHOD'];

		if($method != 'POST' ){
			json_output(400,array('status' => 400,'message' => 'Bad request.'));
		} else {
			
			 $check_auth_client = $this->MyModel->check_auth_client();
			
			
			if($check_auth_client == true){
				$params = $_REQUEST;
		        
		        $username = $params['username'];
		        $password = $params['password'];

		        	
		        $response = $this->MyModel->login($username,$password);
				json_output(200,$response);
				
			}
		}
	}

	public function logout()
	{
		$method = $_SERVER['REQUEST_METHOD'];
		if($method != 'POST'){
			json_output(400,array('status' => 400,'message' => 'Bad request.'));
		} else {
			$check_auth_client = $this->MyModel->check_auth_client();
			if($check_auth_client == true){
		        $response = $this->MyModel->logout();
				json_output(200,$response);
				
			}
		}
	}

	public function register()
	{
		$method = $_SERVER['REQUEST_METHOD'];
		if($method != 'POST'){
			json_output(400,array('status' => 400,'message' => 'Bad request.'));
		} else{
			$check_auth_client = $this->MyModel->check_auth_client();
			if($check_auth_client == true){
					$params = json_decode(file_get_contents('php://input'),true); 
					if ($params['user_email'] == "" || $params['user_password'] == "") {
						$respStatus = 400;
						$resp = array('status' => 400,'message' =>  'Email & Password can\'t empty');
					} else {
						$respStatus = 201;
						$params['user_password'] = md5($params['user_password']);
						$params['last_login'] = date('Y-m-d H:i:s');
						$resp = $this->MyModel->register_new_user($params);
						$resp = array('status' => 201,'message' =>  'User registered successfully');
					}
					json_output($respStatus,$resp);
		        
			}
		}
	}
	
}
