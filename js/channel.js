export function getChannelId(){
    let fetchedData = window.fetch(`https://wind-bow.glitch.me/helix/users?login=silvername`)
                        .then(glitchResponse => glitchResponse.json());
    
    let channelId = Promise.resolve(fetchedData)
                            .then(valueId => valueId['data']['0']['id']);

    return channelId ?? "No such streamer :C";
}
