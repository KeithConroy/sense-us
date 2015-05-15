get '/' do
  if logged_in?
    erb :profile
  else
    erb :index
  end
end

post '/session' do
  @user = User.where(user_name: params[:user_name]).first
  if @user && @user.password == params[:password]
    log_in(@user)
    redirect '/'
  else
    status 401
    @login_error = "The username or password you entered is incorrect"
    erb :index
  end
end

get '/logout' do
  if logged_in?
    log_out
    redirect '/'
  else
    status 400
    "Not logged in"
  end
end

post '/users' do
  @user = User.new(
    user_name: params[:user_name],
    email: params[:email],
    password: params[:password]
  )

  if @user.save
    @new_user = @user.user_name
    erb :index
  else
    status 400
    @signup_errors = @user.errors.full_messages
    erb :index
  end
end