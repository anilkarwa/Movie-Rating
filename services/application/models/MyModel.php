<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MyModel extends CI_Model {

    var $client_service = "frontend-angular";
    var $auth_key       = "movieratingappforcodemax";

    public function check_auth_client(){
        $client_service = $this->input->get_request_header('Client-Service', TRUE);
        $auth_key  = $this->input->get_request_header('Auth-Key', TRUE);
        
        if($client_service == $this->client_service && $auth_key == $this->auth_key){
            return true;
        } else {
            return json_output(401,array('status' => 401,'message' => 'Unauthorized.'));
        }
    }

    public function login($username,$password)
    {
        $q  = $this->db->select('user_id,user_displayName,user_password')->from('users')->where('user_email',$username)->get()->row();
       
        if($q == ""){
            return array('status' => 204,'message' => 'Username not found.');
        } else {
            $hashed_password = $q->user_password;
            $id              = $q->user_id;
            $user_name = $q->user_displayName;
        //exit;
            if (hash_equals($hashed_password, md5($password))) {
               $last_login = date('Y-m-d H:i:s');
               $token = md5(rand());
               $expired_at = date("Y-m-d H:i:s", strtotime('+12 hours'));
               $updated_at = date('Y-m-d H:i:s');
               $this->db->trans_start();
               $this->db->where('user_id',$id)->update('users',array('last_login' => $last_login));
               $this->db->insert('users_authentication',array('user_id' => $id,'token' => $token,'expired_at' => $expired_at,'updated_at' => $updated_at));
               if ($this->db->trans_status() === FALSE){
                  $this->db->trans_rollback();
                  return array('status' => 500,'message' => 'Internal server error.');
               } else {
                  $this->db->trans_commit();
                  return array('status' => 200,'message' => 'Successfully login.','id' => $id,'name'=>$user_name,'token' => $token);
               }
            } else {
               return array('status' => 204,'message' => 'Wrong password.');
            }
        }
    }

    public function logout()
    {
        $users_id  = $this->input->get_request_header('User-ID', TRUE);
        $token     = $this->input->get_request_header('Authorization', TRUE);
        $this->db->where('user_id',$users_id)->where('token',$token)->delete('users_authentication');
        return array('status' => 200,'message' => 'Successfully logout. ' .$token);
    }

    public function auth()
    {
        $users_id  = $this->input->get_request_header('User-ID', TRUE);
        $token     = $this->input->get_request_header('Authorization', TRUE);
        $q  = $this->db->select('expired_at')->from('users_authentication')->where('user_id',$users_id)->where('token',$token)->get()->row();
        if($q == ""){
            return json_output(401,array('status' => 401,'message' => 'Unauthorized User. '.$users_id. ' '. $token));
        } else {
            if($q->expired_at < date('Y-m-d H:i:s')){
                return json_output(401,array('status' => 401,'message' => 'Your session has been expired.'));
            } else {
                $updated_at = date('Y-m-d H:i:s');
                $expired_at = date("Y-m-d H:i:s", strtotime('+12 hours'));
                $this->db->where('user_id',$users_id)->where('token',$token)->update('users_authentication',array('expired_at' => $expired_at,'updated_at' => $updated_at));
                return array('status' => 200,'message' => 'Authorized.');
            }
        }
    }

    public function register_new_user($data)
    {
        return $this->db->insert('users',$data);
        return array('status' => 201,'message' => 'User has been registered.');
    }


    public function movies_list($pageno,$isDesc,$sortColumnName,$searchValue)
    {
        if($isDesc == 'false'){ $sorting ='asc';} else{$sorting ='desc';}
        $user_id =$this->input->get_request_header('User-ID', TRUE);
        if($user_id == null || $user_id == ""){
            $user_id = "0";
        }
        if($sortColumnName == "") $sortColumnName ='rating';
        $no_of_records_per_page = 10;
        $offset = ($pageno-1) * $no_of_records_per_page;
        if($searchValue ==""){
            $total_rows = $this->db->select('movies.*,(select TRUNCATE(AVG(ratings.user_rating),1) from ratings where ratings.movie_id= movies.movie_id ) as rating')->from('movies')->count_all_results();
            $total_pages = ceil($total_rows / $no_of_records_per_page);
            //pagination 
            $pagination_result =$this->db->select('movies.*,COALESCE((select TRUNCATE(AVG(ratings.user_rating),1) from ratings where ratings.movie_id= movies.movie_id ),0) as rating,r.user_rating')->from('movies')
            ->join('ratings as r','movies.movie_id = r.movie_id and r.user_id='.$user_id,'left')->order_by($sortColumnName,$sorting )->limit($no_of_records_per_page,$offset)->get()->result();
            return array('status' => 200,'total_records' => $total_rows,'$total_pages'=> $total_pages,'data'=>$pagination_result);
        } else{
            $total_rows = $this->db->select('movies.*,(select TRUNCATE(AVG(ratings.user_rating),1) from ratings where ratings.movie_id= movies.movie_id ) as rating')->from('movies')->like('movie_name', $searchValue)->count_all_results();
            $total_pages = ceil($total_rows / $no_of_records_per_page);
            //pagination 
            $pagination_result =$this->db->select('movies.*,COALESCE((select TRUNCATE(AVG(ratings.user_rating),1) from ratings where ratings.movie_id= movies.movie_id ),0) as rating,r.user_rating')->from('movies')
            ->join('ratings as r','movies.movie_id = r.movie_id and r.user_id='.$user_id,'left')->like('movie_name', $searchValue)->order_by('rating','desc' )->limit($no_of_records_per_page,$offset)->get()->result();
            return array('status' => 200,'total_records' => $total_rows,'$total_pages'=> $total_pages,'data'=>$pagination_result);
        }
    }

    public function user_rate_movie($data){
        $this->db->insert('ratings',$data);
        return array('status' => 201,'message' => 'Thank you, Rating saved');
    }



}
