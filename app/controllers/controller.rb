get '/social' do
  erb :social
end

post '/save' do
  @result = Result.new(
    user_id: current_user.id,
    estimate_id: params[:date],
    state: params[:state],
    births: params[:births],
    deaths: params[:deaths],
    pop: params[:pop],
  )
  if @result.save

  else
    status 404
    'result not saved'
  end

end

get '/saved' do
  @results = current_user.results
  @dates = @results.map { |result| Estimate.find(result.estimate_id) }
  erb :saved
end

delete '/delete/:id' do
  @result = Result.where(id: params[:id]).first
  @result.destroy
  params[:id]
end