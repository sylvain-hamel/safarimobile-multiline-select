#Problem
Safari for mobile ignores the 'size' attribute of \<select\> elements. It always renders a one-line high drop down list instead of a multiline list box.

#Solution
If the browser is Safari for mobile, this plugin hides the \<select\> and replaces it by something that looks and acts like a list. 


#Usage

##Code:

	$().ready(function () {
		$("select").fixForSafariMobile();
	})

## Style for height and width
The plugin is not able to set a good value for the height and width of the list it creates (send a pull request if you fix this). For now, you must define styles to set a correct height and width. The plugin generates an 'id' for the replacement list based on the original select's id by appending '_safarimobile' to the name. You should defne styles like this:

    #select1_safarimobile { height: 200px;  width:200px; } 
    #select2_safarimobile { height: 100px;  width:150px; } 

#Details
* The original \<select\> is not removed from the DOM so existing code can still change or access its value. The plugin keeps its value in sync with the replacement list's current value.
* The plugin is uses hardcoded styles that are injected in the DOM. I did that to ship the plugin as a single file. You can change the source code or just add styles to your stylesheet to override the plugin's default styles.
*  It only works for single selection (send a pull request if you need multiple selection support).
