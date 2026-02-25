<?Php
function checkIsJSON1($string){
   return is_string($string) && is_array(json_decode($string, true)) ? true : false;
}
function conversiobot_custom_settings() {    
?>
<style>
table, th, td {
  border: 1px solid #ddd;
  border-collapse: collapse;
}
table.table td,table.table th{
    text-align: left;
    padding: 10px;
}
table.table th{
   padding: 10px;
   color: #fff; 
    background-color: gray;
}
input,select{
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    
}
table.table td input{
    width: 100%;
    height : 30px;
}
.table td select{
    width: 100%;
    height : 30px;
    padding: 0px;
}
table.table td  a,table.table th a{
    text-decoration: none;
    background: #F0373D;
    color: #fff;
    font-weight: 900;
    float: left;
    line-height: 11px;
    font-size: 15px;
    padding: 8px;
}
table.table th a{
    color: #EDFAF3;
    background: #1BB978;
    padding: 6px;
    font-weight: 900;
}

/*****************   tabs ******************/

.tab-content{
    background: #fdfdfd;
    line-height: 25px;
    border: 1px solid #ddd;
    border-top:5px solid #FFA12B;
    border-bottom:5px solid #FFA12B;
    padding:30px 25px;
}
ul.tab_ul  {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  height : 46px;
}
.tab_ul li {
  float: left;
}
.tab_ul li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}
.tab_ul li a:hover{
    color: #fff;
}
.tab_ul li.active {
  background-color: #1BB978;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}
</style>
<?php
    $conversiobot_id = get_option('conversiobot_id');
    if(checkIsJSON1($conversiobot_id)){
        $json_decode = json_decode($conversiobot_id, true);
        $default_bot_ids = $json_decode['default_bot_id'];
    }
    else{
        $default_bot_ids = $conversiobot_id;
    }
    ?>
    <div class="wrap">
    	<h2><?php _e( 'ConversioBot', 'conversiobot' ); ?></h2>
    	<?php
    	if(isset($_POST['cb-submit'])) {
    	   
           $total_pages = count($_POST['page_id']);
            $data_array = array();
            $default_bot_id = '';
            if(!empty($_POST['conversiobot_id'])){
                $default_bot_id = $_POST['conversiobot_id'];
            }
            for($pages=0;$pages<$total_pages;$pages++){
                if(!empty($_POST['page_conversiobot_id'][$pages]) OR !empty($_POST['page_id'][$pages])){                
                    $data_array[] = 
                         array(
                         'type' => "pages",
                         'id' => $_POST['page_id'][$pages],
                         'bot_id' => $_POST['page_conversiobot_id'][$pages]
                    );   
                }
            }
            $total_post = count($_POST['post_id']);
            for($post=0;$post<$total_post;$post++){
                if(!empty($_POST['post_conversiobot_id'][$post]) OR !empty($_POST['post_id'][$post])){               
                    $data_array[] = 
                         array(
                         'type' => "post",
                         'id' => $_POST['post_id'][$post],
                         'bot_id' => $_POST['post_conversiobot_id'][$post]
                    );   
                }
            }
            $data = array(
                "default_bot_id" => $default_bot_id,
                "values" => $data_array
            );
            $json_data  = json_encode($data);
            add_option( 'conversiobot_id', $json_data) or update_option( 'conversiobot_id',$json_data );
            $location  = $_SERVER['REQUEST_URI']."&s=1";
            echo '<div class="updated fade"><p><strong>Loading...Please Wait</strong></p></div>';
            $redirectURL    =  $location;
            echo ("<script>location.href='$redirectURL'</script>");
        }
         
        if($_GET['s'] == 1){
            echo '<div class="updated fade"><p><strong> Settings Saved.</strong></p></div>';
        }
          ?>
          <div id="cb-message" class="manage-menus">
        <h2><?php _e( 'ConversioBot Widget Script Instruction:', 'conversiobot' ); ?></h2>
        <p>1. If you don't have a ConversioBot account, <a href="https://conversiobot.com" target="_blank">go here to sign up</a>.</p>
        <p>2. Build your own Bot with our drag-and-drop builder or use one of our templates. No coding is required!</p>
        <p>3. Copy the code from the "Publish" section of your Bot and paste it here.</p>	
		<form method="post" action="" id="wp_conversiobot_form">
        
        <p><label style="vertical-align: baseline;" for="conversiobot_id"><strong>Default Bot ID</strong></label></p>
                    <p><input type="text" name="conversiobot_id" id="conversiobot_id" value="<?php echo $default_bot_ids; ?>" style="width: 300px;height: 40px;" /></p> 
                   <ul class="tab_ul" style="background-color: #5867DD;">
                        <li class="tabli tab_page active" onclick="clickTabLi('tab_page');"><a href="javascript:void(0);">Page</a></li>
                        <li class="tabli tab_post" onclick="clickTabLi('tab_post');"><a href="javascript:void(0);">Post</a></li>
                   </ul>
                  
                  <div class="tab-content">
                   
                    
                    <div class="tab-pane fade show active" id="tab_page">
                      <table class="table" id="table_pages" border="0">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th style="width: 250px;">Pages</th>
                            <th style="width: 250px;"><label style="vertical-align: baseline;" for="conversiobot_id"><strong><?php _e( 'Bot ID', 'conversiobot' ); ?></strong></label></th>
                            <th><a href="javascript:void(0);" title="Add More Bot" onclick="addTableRow($('#table_pages'),'pages');">+</a></th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $pages_count = 0;
                    $sno = 0;
                    if(count($json_decode['values'])>0){
                          for($i=0;$i<count($json_decode['values']);$i++){
                            if($json_decode['values'][$i]['type'] == 'pages'){
                            ?>
                                <tr>
                                    <td><label><?php echo $sno+1;  ?></label></td>
                                    <td>
                                        <select name="page_id[]" id="pages_id_<?php echo $sno; ?>">
                                            <option value="">Select</option>
                                            <?php
                                            $pages = get_pages();
                                            foreach($pages as $page) { ?>
                                                <option <?php if($json_decode['values'][$i]['id'] == $page->ID){echo "selected";} ?> value="<?php echo $page->ID; ?>"><?php echo$page->post_title; ?></option>
                                            <?php } ?>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" name="page_conversiobot_id[]" id="conversiobot_pages_id_<?php echo $sno; ?>" value="<?php echo $json_decode['values'][$i]['bot_id'];  ?>" />
                                    </td>
                                    <td>
                                        <a href="javascript:void(0);" title="Delete Bot" onclick="removeTableRow($('#table_pages'),this);" style="float: left;">x</a>
                                    </td>
                                </tr>
                                <?php
                                $pages_count++;
                                $sno++;
                            }
                          }
                    }
                    if($pages_count == 0){
                    ?>
                        <tr>
                            <td><label>1</label></td>
                            <td>
                                <select name="page_id[]" id="pages_id_0">
                                    <option value="">Select</option>
                                    <?php
                                    $pages = get_pages();
                                    foreach($pages as $page) { ?>
                                        <option value="<?php echo $page->ID; ?>"><?php echo$page->post_title; ?></option>
                                    <?php } ?>
                                </select>
                            </td>
                            <td>
                                <input type="text" name="page_conversiobot_id[]" id="conversiobot_pages_id_0" />
                            </td>
                            <td>
                                <a href="javascript:void(0);" title="Remove Row" onclick="removeTableRow($('#table_pages'),this);" style="float: left;">x</a>
                            </td>
                        </tr>
                    <?php
                    }
                    ?>
                    </tbody>
                </table>
                    </div>
                    <div class="tab-pane fade" id="tab_post" style="display: none;">
                      <table class="table" id="table_posts">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th style="width: 250px;">Post</th>
                            <th style="width: 250px;"><label style="vertical-align: baseline;" for="conversiobot_id"><strong><?php _e( 'Bot ID', 'conversiobot' ); ?></strong></label></th>
                            <th><a href="javascript:void(0);" title="Add More Bot" onclick="addTableRow($('#table_posts'),'post');">+</a></th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php
                    $post_count = 0;
                    $sno = 0;
                    if(count($json_decode['values'])>0){
                          for($j=0;$j<count($json_decode['values']);$j++){
                            if($json_decode['values'][$j]['type'] == 'post'){
                            ?>
                                <tr>
                                    <td><label><?php echo $sno+1;  ?></label></td>
                                    <td>
                                        <select name="post_id[]" id="post_id_<?php echo $sno; ?>">
                                            <option value="">Select</option>
                                            <?php
                                            global $post;
                                            $args = array( 'numberposts' => -1);
                                            $posts = get_posts($args);
                                            foreach( $posts as $post ) : setup_postdata($post); ?>
                                                <option <?php if($json_decode['values'][$j]['id'] == $post->ID){echo "selected";} ?> value="<?php echo $post->ID; ?>"><?php the_title(); ?></option>
                                            <?php endforeach; ?>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text" name="post_conversiobot_id[]" id="conversiobot_post_id_<?php echo $sno; ?>" value="<?php echo $json_decode['values'][$j]['bot_id'];  ?>" />
                                    </td>
                                    <td>
                                        <a href="javascript:void(0);" title="Delete Bot" onclick="removeTableRow($('#table_posts'),this);">x</a>
                                    </td>
                                </tr>
                                <?php
                                $post_count++;
                                $sno++;
                                }
                          }
                    }
                    if($post_count == 0){
                    ?>
                        <tr>
                            <td><label>1</label></td>
                            <td>
                                <select name="post_id[]" id="post_id_0">
                                    <option value="">Select</option>
                                    <?php
                                    global $post;
                                    $args = array( 'numberposts' => -1);
                                    $posts = get_posts($args);
                                    foreach( $posts as $post ) : setup_postdata($post); ?>
                                        <option value="<?php echo $post->ID; ?>"><?php the_title(); ?></option>
                                    <?php endforeach; ?>
                                </select>
                            </td>
                            <td>
                                <input type="hidden" name="post_type[]" id="conversiobot_page_type_0" value="post" />
                                <input type="text" name="post_conversiobot_id[]" id="conversiobot_post_id_0" value="" />
                            </td>
                            <td>
                                <a href="javascript:void(0);" title="Remove Row" onclick="removeTableRow($('#table_posts'),this);">x</a>
                            </td>
                        </tr>
                    <?php
                    }
                    ?>
                    </tbody>
                </table>
                    </div>
                   
                  </div>
        <p>
            <input name="cb-submit" id="cb-submit" type="submit" value="<?php _e( 'Save Changes','conversiobot' ); ?>" class="button button-primary" />
			<?php 
			settings_fields( 'conversiobot-settings' );
			// Output any sections defined for page sl-settings
			do_settings_sections( 'conversiobot-settings' );
			?>
		</form>
	</div>
    </div>
 <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
<script type="text/javascript">
    function clickTabLi(tabid){
        var tabId = tabid;
        $('.tabli').removeClass('active');
        $('.tab-pane').hide();
        $('.'+tabid).addClass('active');
        $('#'+tabid).show();
    }  
    
    function addTableRow(jQtable,type) {
        formId              =   jQtable.attr('id');
        formIdStarter       =   jQtable.attr('id').split(/_(.+)?/)[0];
        lastId = jQtable.find('tr:last input:first').attr('id');
        thenum = lastId.match(/\d+/g);
        newId = Number(thenum) + 1;
        newrow= jQtable.find('tr:last').clone();
        newrow.find('label:first').html(newId+1);
        newrow.attr('class',newId);
        newrow.find('input,select,td').each(function() {
            this.id= this.id.replace(/\d+/,newId);
            (this.name!==undefined) ? this.name= this.name.replace(/\d+/,newId) : this.style  =   '';
        });
        jQtable.append(newrow);
        $('#conversiobot_'+type+'_id_'+newId).val('');
        $('#'+type+'_id_'+newId).val('');
    }
    
    function removeTableRow(jQtable,evt) {
        formIdStarter   =   jQtable.attr('id').split(/_(.+)?/)[0];
        var num_rows    =   jQtable.find('tr:gt(0)').length;
        if(num_rows>1){
            var tr  =   $(evt).parent().parent();
            if(isRowEmpty(tr)) {
                $(evt).parents('tr').remove();
                
                var i=0;
                jQtable.find('tr:gt(0)').each(function() { 
                    $(this).find('input,select,textarea,.errorMessage').each(function()
                    {
                        old_id   =   $(this).attr('id');
                        new_id   =   old_id.replace(/\d+/,i);
                        $(this).attr('id',new_id);
                        old_name =   $(this).attr('name');
                        if(old_name!==undefined) {
                            new_name =   old_name.replace(/\d+/,i);
                            $(this).attr('name',new_name);
                        } 
                    });
                    $(this).find('td:first label').html(++i); 
                }); 
            }
        } 
        else{
            alert('Atleast one row needed here'); 
        }
    }
                    
    function isRowEmpty(tr) {
        var rowfilled=false; 
        tr.find('td:gt(0)').each(function() { 
            inpt    =   $(this).find('input').val(); 
            if(typeof inpt !== 'undefined' && inpt!=='') { 
                rowfilled=true; return false;  
            } 
        }); 
        if(rowfilled) 
            return (confirm('Are you sure you want to delete this Bot?')); 
            return true; 
    }
</script>   
<?php
}
?>