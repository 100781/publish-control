<div class="wrap">
	<h1>Publish Control</h1>
	<form method="POST">
		<input type="hidden" name="action" value="update">
		<table class="form-table">
			<tbody>
				<tr>
					<th scope="row">Apply to Post Types</th>
					<td>
						<fieldset><legend class="screen-reader-text"><span>Apply to Post Types</span></legend>
							<label for="pubcontrol-types"></label>
							<br>
								<?php
								$postTypes = get_post_types(["public" => true]);
								$postTypesSet = get_option('pubcontrol_posttypes');
								foreach($postTypes as $type){
									$checked = (in_array($type, explode(",", $postTypesSet)) ? "checked" : "");
									print "<input type=\"checkbox\" name=\"pubcontrol-posttypes[]\" id=\"posttype-{$type}\" value=\"{$type}\" {$checked}>{$type}</input><br>";
								}
								?>
							<br>
							<p class="description">Leave unchecked to apply Publish Control to all post types.</p>
						</fieldset>
					</td>
				</tr>
				<tr>
					<th scope="row">Publish Control Message</th>
					<td><fieldset><legend class="screen-reader-text"><span>Publish Control Message</span></legend>
							<textarea class="large-text code" rows="10" cols="50" name="pubcontrol-message" id="pubcontrol-message"><?php print get_option('pubcontrol_message'); ?></textarea>
						</fieldset>
					</td>
				</tr>
			</tbody>
		</table>
		<p class="submit">
			<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
		</p>
	</form>
</div>
