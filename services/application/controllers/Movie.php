<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Movie extends CI_Controller {

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

    public function movielist(){
        $method = $_SERVER['REQUEST_METHOD'];
		if($method != 'POST'){
			json_output(400,array('status' => 400,'message' => 'Bad request.'));
		} else {
			$check_auth_client = $this->MyModel->check_auth_client();
			if($check_auth_client == true){
					$params = $_REQUEST;
					if ($params['pageno'] =="") {
						$params['pageno'] = 1;
					} else {
		        		$resp = $this->MyModel->movies_list($params['pageno'],$params['isDesc'],$params['sortingColumnName'],$params['searchValue']);
					}
					json_output(200,$resp);	
			}
		}
    }

    public function ratemovie(){
        $method = $_SERVER['REQUEST_METHOD'];
		if($method != 'POST'){
			json_output(400,array('status' => 400,'message' => 'Bad request.'));
		} else {
			$check_auth_client = $this->MyModel->check_auth_client();
			if($check_auth_client == true){
		        $response = $this->MyModel->auth();
		        $respStatus = $response['status'];
		        if($response['status'] == 200){
					$params = json_decode(file_get_contents('php://input'),true); 
				
		        	$resp = $this->MyModel->user_rate_movie($params);
					json_output($respStatus,$resp);
		        }
			}
		}
    }


}
