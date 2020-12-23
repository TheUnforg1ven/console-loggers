export function getChannelId(channelName){
    let fetchedData = window.fetch(`https://wind-bow.glitch.me/helix/users?login=${channelName}`)
                        .then(glitchResponse => glitchResponse.json());
    

    let channelId = Promise.resolve(fetchedData)
                        .then(valueId => {
                            if (valueId['data'] && valueId['data'].length !== 0) {
                                return valueId['data']['0']['id'];
                            }
                            else {
                                alert("No such streamer :C");
                                return "No such streamer :C";
                            }
                        })
                        .catch(error => console.log(error));
    

    return channelId ?? "No such streamer :C";
}
